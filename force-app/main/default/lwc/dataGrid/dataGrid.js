import { LightningElement, api, track } from 'lwc';

export default class DataGrid extends LightningElement {
    @api mainRecords = [];    
    
    @api firstLevelColumns = [];
    @api secondLevelColumns = [];
    @api thirdLevelColumns = [];

    @track processedMainRecords;
    @track processedFirstLevel;
    @track processedSecondLevel;
    @track processedThirdLevel;

    expandedItems = [];

    connectedCallback() {        
        this.processedMainRecords = this.processRecords(this.mainRecords);
    }

    processRecords(mainObject) {
        const columns = mainObject?.columns;
        const records = mainObject?.data;

        return records.map(record => {
            // Mapeia as células para cada pedido (nível 1)
            const cells = columns.map((column, index) => {
                return {
                    firstField: index === 0, 
                    fieldName: column.fieldName,
                    label: column.label,
                    value: record[column.fieldName] || '', // Valor da célula
                    isDate: column.type ==='date', 
                    isNumber: column.type ==='number', 
                    isCurrency: column.type ==='currency'                    
                };
            });

            // Mapeia os itens filhos (nível 2)
            let processedFirstLevel;
            if(record?.children){
                const columns = record?.children?.columns;
                const records = record?.children?.data;

                processedFirstLevel = records.map(levelOneChild => {                
                    const childCells = columns.map((column,index) => {
                        return {
                            firstField: index === 0, 
                            fieldName: column.fieldName,
                            label: column.label,
                            value: levelOneChild[column.fieldName] || '', // Valor da célula
                            isDate: column.type ==='date', 
                            isNumber: column.type ==='number', 
                            isCurrency: column.type ==='currency'
                        };
                    });

                    // Mapeia as notas (nível 3)                     
                    let processedSecondLevel;
                    
                    if(levelOneChild?.children){
                        const columns = levelOneChild?.children?.columns;
                        const records = levelOneChild?.children?.data;

                     
                        processedSecondLevel = records.map(levelTwoChild => {
                            const levelTwoChildCells = columns.map((column,index) => {
                                return {
                                    firstField: index === 0, 
                                    fieldName: column.fieldName,
                                    label: column.label,
                                    value: levelTwoChild[column.fieldName] || '', // Valor da célula
                                    isDate: column.type ==='date', 
                                    isNumber: column.type ==='number', 
                                    isCurrency: column.type ==='currency'
                                };
                            });

                            // Mapeia as notas (nível 4)
                            let processedThirdLevel;
                            
                            if(levelTwoChild?.children){
                                const columns = levelTwoChild?.children?.columns;
                                const records = levelTwoChild?.children?.data;

                                processedThirdLevel = records.map(levelThreeChild => {
                                    const levelThreeChildCells = columns.map((column,index) => {
                                        return {
                                            firstField: index === 0, 
                                            fieldName: column.fieldName,
                                            label: column.label,
                                            value: levelThreeChild[column.fieldName] || '', // Valor da célula
                                            isDate: column.type ==='date', 
                                            isNumber: column.type ==='number', 
                                            isCurrency: column.type ==='currency'
                                        };
                                    });
                                    return {
                                        id: levelThreeChild.id,
                                        cells: levelThreeChildCells                                        
                                    };
                                });
                            }
                            
                            return {
                                id: levelTwoChild.id,
                                cells: levelTwoChildCells,
                                expanded: `expanded-two-${levelTwoChild.id}`,
                                thirdLevelRecords: processedThirdLevel,
                                thirdLevelColumns: levelTwoChild?.levelType === 'itemMae' ? this.thirdLevelColumns.parent : this.thirdLevelColumns.child,
                                isExpanded: false, // Estado de expansão
                                icon: 'utility:chevronright',                                
                            };
                        });                    
                    }
                    
                    return {
                        id: levelOneChild.id,
                        cells: childCells,
                        expanded: `expanded-one-${levelOneChild.id}`,
                        secondLevelRecords: processedSecondLevel,
                        secondLevelColumns: levelOneChild?.levelType === 'itemMae' ? this.secondLevelColumns.parent : this.secondLevelColumns.child,
                        isExpanded: false, // Estado de expansão
                        icon: 'utility:chevronright',                         
                    };
                });
            }

            return {
                ...record,
                cells, // Células do pedido
                expanded: `expanded-${record.id}`,                                
                firstLevelRecords: processedFirstLevel, // Itens filhos processados
                firstLevelColumns: record?.levelType === 'itemMae' ? this.firstLevelColumns.parent : this.firstLevelColumns.child ,
                isExpanded: false, // Estado de expansão
                icon: 'utility:chevronright',
            };
        });
    }

    handleExpandMainRecord(event) {
        const recordId = parseInt(event.currentTarget.dataset.id, 10);
        const record = this.processedMainRecords.find(record => record.id === recordId);

        if (record) {
            this.changeElement(record);                    
        }
    }

    handleExpandLevelOne(event) {
        const recordId = parseInt(event.currentTarget.dataset.id, 10);
    
        // Percorre os registros principais para encontrar o registro correspondente
        this.processedMainRecords.forEach(mainRecord => {
            if (mainRecord.firstLevelRecords) {
                // Procura o registro de nível 2 (first level) dentro do registro principal
                const levelOneRecord = mainRecord.firstLevelRecords.find(record => record.id === recordId);
    
                if (levelOneRecord) {
                    this.changeElement(levelOneRecord);
                }
            }
        });
    }

    handleExpandLevelTwo(event) {
        const recordId = parseInt(event.currentTarget.dataset.id, 10);
    
        // Percorre os registros principais para encontrar o registro correspondente
        this.processedMainRecords.forEach(mainRecord => {
            if (mainRecord.firstLevelRecords) {
                // Percorre os registros de nível 2 (first level)
                mainRecord.firstLevelRecords.forEach(levelOneRecord => {
                    if (levelOneRecord.secondLevelRecords) {
                        // Procura o registro de nível 3 (second level) dentro do registro de nível 2
                        const levelTwoRecord = levelOneRecord.secondLevelRecords.find(record => record.id === recordId);
    
                        if (levelTwoRecord) {
                            this.changeElement(levelTwoRecord);
                        }
                    }
                });
            }
        });
    }

    changeElement(elem){
        // Alterna o estado de expansão e o ícone
        const isExpanded = elem.icon === 'utility:chevrondown';
        elem.icon = isExpanded ? 'utility:chevronright' : 'utility:chevrondown';
        elem.isExpanded = !isExpanded;

        // Atualiza a lista de itens expandidos
        if (!isExpanded) {
            this.expandedItems = [...this.expandedItems, elem.id];
        } else {
            this.expandedItems = this.expandedItems.filter(id => id !== elem.id);
        }

        return elem;
    }
}