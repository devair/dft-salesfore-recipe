public without sharing class CaseFormController {


    @AuraEnabled
    public static Object getSubSubjectField(Id recordId ){
        List<Map<String, String>> fieldsList = new List<Map<String, String>>();

        try {            
            List<BankingSubSubjects__c> sobjList = [SELECT Id, Name, AdditionalInformation__c FROM  BankingSubSubjects__c 
                                                    WHERE Id = :recordId ];         

            if(!sobjList.isEmpty() && sobjList.size()==1){
                
                BankingSubSubjects__c obj = sobjList.get(0);

                List<String> splitValues = obj.AdditionalInformation__c.split(';');


                Map<String, Map<String, String>> fieldsMap = getFieldsObjectMetadata('Case');

                for(String fieldName: splitValues){
                    Map<String, String> fieldMetadata = fieldsMap.get(fieldName);

                    if(fieldMetadata != null){
                        fieldsList.add(fieldMetadata);
                    }
                }

                return fieldsList;
            } 
            else { 
                return null;
            } 

        } catch (Exception e) { 
            throw new AuraHandledException(e.getMessage());
        }        
    }

    @AuraEnabled
    public static String getRecordTypeNameById(String recordTypeId) {
        RecordType rt = [SELECT Name FROM RecordType WHERE Id = :recordTypeId LIMIT 1];
        return rt.Name;
    }

    @AuraEnabled
    public static Id getSingleRecordTypeForUser() {
        // Obtenha o ID do objeto Case
        Schema.DescribeSObjectResult caseDescribe = Case.sObjectType.getDescribe();

        // Obtenha todos os RecordTypes disponíveis para o usuário atual
        Map<String, Schema.RecordTypeInfo> recordTypeInfoMap = caseDescribe.getRecordTypeInfosByDeveloperName();
        
        List<Schema.RecordTypeInfo> userRecordTypes = new List<Schema.RecordTypeInfo>();
        
        for (Schema.RecordTypeInfo rtInfo : caseDescribe.getRecordTypeInfos()) {
            System.debug(rtInfo);
            if (rtInfo.isAvailable() && !rtInfo.isMaster()) { // Verifica se o RecordType está disponível para o usuário
                userRecordTypes.add(rtInfo);
            }
        }
        
        // Verifica se há apenas um RecordType disponível
        if (userRecordTypes.size() == 1) {
            return userRecordTypes[0].getRecordTypeId();
        }
        
        return null; // Se houver mais de um ou nenhum RecordType disponível
    }

    private static Map<String, Map<String, String>> getFieldsObjectMetadata(String apiObjectName){

        Map<String, Schema.SObjectField> fieldMap = Schema.getGlobalDescribe().get(apiObjectName).getDescribe().fields.getMap();
        Map<String, Map<String, String>> fieldInfoMap = new Map<String, Map<String, String>>();

        // Percorre a lista de campos passados
        for (String fieldName : fieldMap.keySet() ) {
            if (fieldMap.containsKey(fieldName)) {
                Schema.DescribeFieldResult fieldDescribe = fieldMap.get(fieldName).getDescribe();
                
                // Cria um Map com as informações do campo
                Map<String, String> fieldInfo = new Map<String, String>();       
                fieldInfo.put('label', fieldDescribe.getLabel());
                fieldInfo.put('name', fieldDescribe.getName());
                fieldInfo.put('type', fieldDescribe.getType().name());
                
                // Adiciona o Map na lista
                fieldInfoMap.put(fieldDescribe.getName(), fieldInfo);
            }
        }

        return fieldInfoMap;
    }
}