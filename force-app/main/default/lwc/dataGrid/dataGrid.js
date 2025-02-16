import { LightningElement, api, track } from 'lwc';

export default class DataGrid extends LightningElement {
    @api parentColumns = [];        
    @api childColumns =[]
    @api records = [];    
    @track processedRecords;
    @track processedChildren;

    expandedItems = [];

    connectedCallback() {        
        this.processedRecords = this.processRecords(this.records);
    }

    processRecords(records) {
        return records.map(record => {
            // Mapeia as células para cada pedido
            const cells = this.parentColumns.map((column, index) => {
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

            // Mapeia os itens filhos (children)
            const processedChildren = record.children.map(child => {
                const childCells = this.childColumns.map(column => {
                    return {
                        fieldName: column.fieldName,
                        label: column.label,
                        value: child[column.fieldName] || '', // Valor da célula
                        isDate: column.type ==='date', 
                        isNumber: column.type ==='number', 
                        isCurrency: column.type ==='currency'
                    };
                });
                return {
                    id: child.id,
                    cells: childCells
                };
            });

            return {
                ...record,
                cells, // Células do pedido
                expanded: `expanded-${record.id}`,
                processedChildren, // Itens filhos processados
                isExpanded: false, // Estado de expansão
                icon: 'utility:chevronright',
            };
        });
    }

    handleExpand(event) {
        const recordId = parseInt(event.currentTarget.dataset.id, 10);
        const record = this.processedRecords.find(record => record.id === recordId);

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