public with sharing class AccountContactController {
    
    @AuraEnabled(cacheable=true)
    public static List<AccountWrapper> getAccountsWithChildren(String searchTerm ) {
        
        List<AccountWrapper> accountList = new List<AccountWrapper>();            
        
        if(String.isEmpty(searchTerm)){
            List<Account> parentAccounts = getAccounts();
            for(Account acc: parentAccounts){
                AccountWrapper accWrapper = new AccountWrapper();
                accWrapper.id = acc.Id;
                accWrapper.label = acc.Name;
                accWrapper.name = acc.Name;
                accWrapper.phone = acc.Phone;
                accWrapper.status = acc.BlockStatus__c;
                accWrapper.parentId = null;
                accWrapper.children = new List<AccountWrapper>();

                for (Account con : acc.ChildAccounts) {
                    AccountWrapper contactWrapper = new AccountWrapper();
                    contactWrapper.id = con.Id;
                    contactWrapper.label = con.Name;
                    contactWrapper.name = con.Name;
                    contactWrapper.phone = con.Phone;
                    contactWrapper.status = con.BlockStatus__c;
                    contactWrapper.parentId = acc.Id;
                    
                    accWrapper.children.add(contactWrapper);
                }
                accountList.add(accWrapper);
            }
        }
        else{
            // Get Children Accounts with the search term even null
            List<Account> childrenAccounts = getAccounts(searchTerm, false, null);
            Map<Id, List<AccountWrapper>> mapChildrenAccounts = new Map<Id, List<AccountWrapper> > ();

            for(Account acc: childrenAccounts){  
                AccountWrapper child= new AccountWrapper();
                child.id = acc.Id;
                child.label = acc.Name;
                child.name = acc.Name;
                child.phone = acc.Phone;
                child.status = acc.BlockStatus__c;
                child.parentId = acc.ParentId;

                List<AccountWrapper> children = mapChildrenAccounts.get(acc.ParentId);
                if(children == null) {
                    children = new List<AccountWrapper> { child };
                    mapChildrenAccounts.put(acc.ParentId, children );
                }
                else{
                    children.add(child);
                }
            }

            Set<Id> parentsId;
            if( !mapChildrenAccounts.isEmpty() ) parentsId = mapChildrenAccounts.keySet();

            // Get Parent Accounts with the search term even null
            List<Account> parentAccounts = getAccounts(searchTerm, true, parentsId);    
            Map<Id, AccountWrapper> mapParentAccounts = new Map<Id, AccountWrapper> ();        
    
            for(Account acc: parentAccounts){  
                AccountWrapper accWrapper = new AccountWrapper();
                accWrapper.id = acc.Id;
                accWrapper.label = acc.Name;
                accWrapper.name = acc.Name;
                accWrapper.phone = acc.Phone;
                accWrapper.status = acc.BlockStatus__c;
                accWrapper.parentId = null;
                accWrapper.children = new List<AccountWrapper>();
                mapParentAccounts.put(acc.Id, accWrapper);
            }
            
            // Buscar todas as contas com contatos relacionados
            
            for (AccountWrapper acc : mapParentAccounts.values()) {
                List<AccountWrapper> children = mapChildrenAccounts.get(acc.id);
                if(children != null) acc.children.addAll(children);
                accountList.add(acc);
            }
        }
        
        
        return accountList;
    }

    public class AccountWrapper {
        @AuraEnabled public String id;
        @AuraEnabled public String label;
        @AuraEnabled public String name;
        @AuraEnabled public String phone;
        @AuraEnabled public String status;
        @AuraEnabled public String parentId;
        @AuraEnabled public List<AccountWrapper> children;
        
    }
    /**
     * Metodo para listar contas sem filtro
     */
    private static List<Account> getAccounts(){
        String query = ' SELECT Id, Name, Phone, toLabel(BlockStatus__c), ParentId, ' +                      
                        ' (SELECT Id, Name, Phone, toLabel(BlockStatus__c) FROM ChildAccounts ) ' +
                        ' FROM Account ' +
                        ' WHERE  ParentId = NULL' +
                        ' ORDER BY Name ' +
                        ' LIMIT 50000 ';
        return Database.query(query);      
    }

    private static List<Account> getAccounts (String searchTerm, Boolean isParent, Set<Id> parentsForChildren ){
        Map<String, Object> bindVariablesMap = new Map<String, Object>();
        
        String query = ' SELECT Id, Name, Phone, toLabel(BlockStatus__c), ParentId ' +                      
                       ' FROM Account ';                       
        if(isParent || String.isEmpty(searchTerm)){
            query += ' WHERE  ParentId = NULL';
        }
        else {
            query += ' WHERE  ParentId != NULL';
        }
               
        List<String> whereFilters = new List<String>();

        if(String.isNotBlank(searchTerm)){
            searchTerm = '%' + searchTerm + '%';
            bindVariablesMap.put('searchTerm', searchTerm);
            whereFilters.add('NAME LIKE :searchTerm ');
        }
        
        if(parentsForChildren != null && !parentsForChildren.isEmpty()){
            bindVariablesMap.put('parentsForChildren', parentsForChildren);   
            whereFilters.add('Id IN:parentsForChildren');
        }

        if(!whereFilters.isEmpty()){
            query += ' AND ( ';            
            for(Integer i=0; i< whereFilters.size(); i++){
                query += ' (' + whereFilters.get(i) + ') ';
                if(i+1< whereFilters.size()) query+= ' OR ';
            }
            query += ') ';
        }

        query += ' ORDER BY Name ' + 
                 ' LIMIT 50000 ';

        System.debug(query);

        return Database.queryWithBinds(query, bindVariablesMap, AccessLevel.USER_MODE);
    }
}