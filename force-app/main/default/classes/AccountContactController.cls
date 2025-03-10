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
                Map<String, String> mapStatusIcon = getStatusIcon(parent.BlockStatus__c);                
                parentWrapper.statusIcon = mapStatusIcon.get('icon');
                parentWrapper.statusIconClass = mapStatusIcon.get('color');

                parentWrapper.webSite = parent.WebSite;
                parentWrapper.backlogOrders = generateRandomNumber();
                parentWrapper.currencyCode = Math.random() >= 0.5 ? 'BRL' : 'USD';
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
                    childWrapper.backlogOrders = generateRandomNumber();

                    Map<String, String> mapStatusIconChild = getStatusIcon(child.BlockStatus__c); 
                    childWrapper.statusIcon = mapStatusIconChild.get('icon');
                    childWrapper.statusIconClass = mapStatusIconChild.get('color');

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

    private static Map<String, String> getStatusIcon(String status){
        Map<String, String> mapStatus = new Map<String, String>();

        switch on status {
            when 'Bloqueio 1' {
                mapStatus.put('color', '--sds-c-icon-color-foreground-default: #ff0000 !important');
                mapStatus.put('icon', 'utility:error');
            }
            when 'Bloqueio 2' {
                mapStatus.put('color', '--sds-c-icon-color-foreground-default: #ffa500 !important');
                mapStatus.put('icon', 'utility:error');
            }
            when 'Bloqueio 3' {
                mapStatus.put('color', 'sds-c-icon-color-foreground-default: #ffff00 !important');
                mapStatus.put('icon', 'utility:error');
            }
            when else {
                mapStatus.put('color', '--sds-c-icon-color-foreground-default: #008000 !important;');
                mapStatus.put('icon', 'utility:success');
            }
        }

        return mapStatus;
    }

    public class AccountWrapper {
        @AuraEnabled public String id;
        @AuraEnabled public String label;
        @AuraEnabled public String name;
        @AuraEnabled public String phone;
        @AuraEnabled public String status;
        @AuraEnabled public String parentId;
        @AuraEnabled public String webSite;
        @AuraEnabled public String currencyCode;
        @AuraEnabled public Integer backlogOrders;
        @AuraEnabled public String statusIconClass;
        @AuraEnabled public String statusIcon;
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

    private static Integer generateRandomNumber() {
        return 100 + Math.mod(Math.abs(Crypto.getRandomInteger()), 9901);
    }
}