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
        const columns = mainObject.columns;
        const records = mainObject.data;

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

            console.table(cells);

            // Mapeia os itens filhos (nível 2)
            let processedFirstLevel;
            if(record.children){
                const columns = record.children.columns;
                const records = record.children.data;

                processedFirstLevel = records.map(levelOneChild => {                
                    const childCells = columns.map(column => {
                        return {
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
                    /*
                    if(levelOneChild.children){
                        processedSecondLevel = levelOneChild.children.map(levelTwoChild => {
                            const levelTwoChildCells = this.secondLevelColumns.map(column => {
                                return {
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
                            if(levelTwoChild.children){
                                processedThirdLevel = levelTwoChild.children.map(levelThreeChild => {
                                    const levelThreeChildCells = this.thirdLevelColumns.map(column => {
                                        return {
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
                                        cells: levelThreeChildCells,
                                        columns: this.thirdLevelColumns
                                    };
                                });
                            }

                            return {
                                id: levelTwoChild.id,
                                cells: levelTwoChildCells,
                                expanded: `expanded-two-${levelTwoChild.id}`,
                                processedThirdLevel,
                                thirdLevelColumns: this.thirdLevelColumns,
                                isExpanded: false, // Estado de expansão
                                icon: 'utility:chevronright',
                                columns: this.secondLevelColumns
                            };
                        });
                    }
                    */
                    return {
                        id: levelOneChild.id,
                        cells: childCells,
                        expanded: `expanded-one-${levelOneChild.id}`,
                        processedSecondLevel,
                        secondLevelColumns: this.secondLevelColumns,
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
                firstLevelColumns: record.tipo === 'Mae' ? this.firstLevelColumns.parent : this.firstLevelColumns.child ,
                isExpanded: false, // Estado de expansão
                icon: 'utility:chevronright',
            };
        });
    }

    handleExpand(event) {
        const recordId = parseInt(event.currentTarget.dataset.id, 10);
        const record = this.processedMainRecords.find(record => record.id === recordId);

        if (record) {
            const isExpanded = record.icon === 'utility:chevrondown';            
            record.icon = isExpanded ? 'utility:chevronright': 'utility:chevrondown',
            record.isExpanded = !isExpanded;
            
            if (!isExpanded) {
                this.expandedItems = [ ... this.expandedItems, record.id];
            }                
            else {                
                this.expandedItems = this.expandedItems.filter(id => id !== record.id);
            }                       
        }
    }
}