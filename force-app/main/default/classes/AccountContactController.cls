public with sharing class AccountContactController {
    
    @AuraEnabled(cacheable=true)
    public static List<AccountWrapper> getAccountsWithChildren(String searchTerm ) {
        
        List<AccountWrapper> accountList = new List<AccountWrapper>();            
        
        if(String.isEmpty(searchTerm)){
            List<Account> parentAccounts = getAccounts(50000, 0);

            for(Account parent: parentAccounts){
                AccountWrapper parentWrapper = new AccountWrapper();
                parentWrapper.id = parent.Id;
                parentWrapper.label = parent.Name;
                parentWrapper.name = parent.Name;
                parentWrapper.phone = parent.Phone;
                parentWrapper.status = parent.BlockStatus__c;
                parentWrapper.webSite = parent.WebSite;
                parentWrapper.backlogOrders = 100;

                parentWrapper.children = new List<AccountWrapper>();              

                for(Account child: parent.ChildAccounts){
                    AccountWrapper childWrapper = new AccountWrapper();
                    childWrapper.id = child.Id;
                    childWrapper.label = child.Name;
                    childWrapper.name = child.Name;
                    childWrapper.phone = child.Phone;
                    childWrapper.status = child.BlockStatus__c;
                    childWrapper.parentId = parent.Id; 
                    childWrapper.webSite = child.WebSite;
                    parentWrapper.children.add(childWrapper);
                }

                accountList.add(parentWrapper);
            }
        }
        else {

            List<Account> matchingAccounts  = getAccounts(searchTerm, 50000, 0);
            Set<Id> parentIds = new Set<Id>(); // parentIds para soql dos pais
            Map<Id, Account> parentMap = new Map<Id, Account>();
            Map<Id, Map<Id, Account>> childMap = new Map<Id, Map<Id,Account>>();

            for(Account acc: matchingAccounts){
                if (acc.ParentId != NULL ){
                    parentIds.add(acc.ParentId);
                }
                else{                     
                    parentMap.put(acc.Id, acc);                                                            
                }  
                                        
                if (!childMap.containsKey( acc.ParentId)) childMap.put(acc.ParentId, new Map<Id,Account>());                    
                childMap.get(acc.ParentId).put(acc.Id, acc);  
            }

            // Buscar contas pais das contas filhas encontradas
            if (!parentIds.isEmpty()) {                
                for (Account parent : [SELECT Id, Name, Phone, toLabel(BlockStatus__c), ParentId 
                                      FROM Account WHERE Id IN :parentIds]) 
                {
                    if(!parentMap.containsKey(parent.Id) ){
                        parentMap.put(parent.Id, parent);
                    }
                }                                             
            }

            // Construir a estrutura de hierarquia
            for (Account parent : parentMap.values()) {
                 
                AccountWrapper parentWrapper = new AccountWrapper();
                parentWrapper.id = parent.Id;
                parentWrapper.label = parent.Name;
                parentWrapper.name = parent.Name;
                parentWrapper.phone = parent.Phone;
                parentWrapper.status = parent.BlockStatus__c;
                parentWrapper.children = new List<AccountWrapper>();              

                Map<Id, Account> children = childMap.get(parent.Id);     

                if (children == null){
                    children = new Map<Id, Account>(parent.ChildAccounts);                     
                } 

                for(Account child: children.values()){                         
                    AccountWrapper childWrapper = new AccountWrapper();
                    childWrapper.id = child.Id;
                    childWrapper.label = child.Name;
                    childWrapper.name = child.Name;
                    childWrapper.phone = child.Phone;
                    childWrapper.status = child.BlockStatus__c;
                    childWrapper.parentId = parent.Id;                         
                    parentWrapper.children.add(childWrapper);
                }

                accountList.add(parentWrapper);
                
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
        @AuraEnabled public String webSite;
        @AuraEnabled public Integer backlogOrders;
        @AuraEnabled public List<AccountWrapper> children;        
    }

    private static List<Account> getAccounts(Integer limitValue, Integer offsetValue){
        return getAccounts(null,50000, 0);
    }
    /**
     * Metodo para listar contas sem filtro
     */
    private static List<Account> getAccounts(String searchTerm, Integer limitValue, Integer offsetValue){

        String query = ' SELECT Id, Name, Phone, toLabel(BlockStatus__c), ParentId, WebSite, ' +                      
                        ' (SELECT Id, Name, Phone, toLabel(BlockStatus__c), ParentId, WebSite FROM ChildAccounts ) ' +
                        ' FROM Account ';
        
        if(String.isEmpty(searchTerm)){
            query += ' WHERE  ParentId = NULL' + 
                    ' ORDER BY Name ' +
                    ' LIMIT :limitValue OFFSET :offsetValue ';
        
            return Database.query(query);      
        }
        else{
            searchTerm = '%'+searchTerm+'%';
            Map<String, Object> bindVariablesMap = new Map<String, Object>();
            bindVariablesMap.put('searchTerm', searchTerm);
            
            query += ' WHERE  Name LIKE :searchTerm' +
                    ' ORDER BY Name ' +
                    ' LIMIT 50000 ';
        
            return Database.queryWithBinds(query, bindVariablesMap, AccessLevel.USER_MODE);
        }                            
    }    
}