public with sharing class OrdersController {   
    @AuraEnabled(cacheable=true)
    public static List<Order> getOrders(Id parentId){
        try {            

            return [
                SELECT Id, OrderNumber, Account.Name, AccountId, ParentAccount__c, ParentAccount__r.Name, tolabel(type), TotalAmount, toLabel(Status),
                ItemCount__c 
                FROM Order
                WHERE
                    ParentAccount__c = :parentId
                ORDER BY OrderNumber desc
            ];
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled(cacheable=false)
    public static List<OrderItem> getOrderItens(Id orderId){
        try {            
            return [                
                SELECT Id, Product2.Name, Quantity FROM OrderItem                
                WHERE
                    OrderId = :orderId
                ORDER BY OrderId desc
            ];
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}