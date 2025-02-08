public with sharing class AccountContactController {
    
    @AuraEnabled(cacheable=true)
    public static List<AccountWrapper> getAccountsWithContacts() {
        List<AccountWrapper> accountList = new List<AccountWrapper>();
        
        // Buscar todas as contas com contatos relacionados
        for (Account acc : [SELECT Id, Name, Phone, toLabel(BlockStatus__c), 
        (SELECT Id, Name, Phone, toLabel(BlockStatus__c) FROM ChildAccounts ) 
        FROM Account 
        WHERE ParentId = NULL
        ORDER BY Name
        LIMIT 50000
        ]
        ) {
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
}