import { LightningElement, api } from 'lwc';

export default class OrderItemDetail extends LightningElement {
    @api columns = [
        {label: 'Produto', name: 'produto', type: 'text'},
        {label: 'Quantidade', name: 'quantidade', type: 'number'},
        {label: 'Qtd. Faturada', name: 'qtdfaturada', type: 'number'},
        {label: 'Qtd. Disponível', name: 'qtddisponivel', type: 'number'},
        {label: 'Entrega', name: 'entrega', type: 'date'},
        {label: 'Valor', name: 'valor', type: 'decimal'},
        {label: 'Pagamento', name: 'pagamento', type: 'text'},
        {label: 'Status', name: 'status', type: 'text'}     
    ];

    @api columnsChildren = [
                
        {label: 'Número', name: 'numero', type: 'text'},
        {label: 'Emissão', name: 'emissao', type: 'date'},
        {label: 'Valor', name: 'valor', type: 'decimal'},        
    ];

    @api records = [
        {
            isExpanded : false,
            icon: 'utility:chevronright',
            id: 1,
            produto: 'PRODUTO 1',
            quantidade: 1200,
            qtdFaturada: 1200,
            qtdDisponível: 0,
            entrega: '2025-12-31',
            valor: 25000,
            pagamento: '15 DDL',
            status: 'Faturado',
            children: [
                { 
                    numero: 123,
                    emissao: '2025-02-13',
                    valor: 25000
                },
                { 
                    numero: 123,
                    emissao: '2025-02-13',
                    valor: 25000
                },
                { 
                    numero: 123,
                    emissao: '2025-02-13',
                    valor: 25000
                }
            ]           
        },
        {         
            isExpanded : false,
            icon: 'utility:chevronright',   
            id: 2,
            produto: 'PRODUTO 2',
            quantidade: 2000,
            qtdFaturada: 1500,
            qtdDisponível: 500,
            entrega: '2025-12-31',
            valor: 1000,
            pagamento: '15 DDL',
            status: 'Faturado parcial',
            children: [
                { 
                    numero: 456,
                    emissao: '2025-01-13',
                    valor: 1000
                },
                { 
                    numero: 456,
                    emissao: '2025-01-13',
                    valor: 1000
                },
                { 
                    numero: 456,
                    emissao: '2025-01-13',
                    valor: 1000
                },
                { 
                    numero: 456,
                    emissao: '2025-01-13',
                    valor: 1000
                }
            ]  
        }
    ];
    
    expandedItems = [ ];
    
    handleItemClick(event) {
        const recordId = parseInt(event.currentTarget.dataset.id, 10);
        const record = this.records.find(rec => rec.id === recordId);

        if (record) {
            const isExpanded = record.icon === 'utility:chevrondown';

            record.icon = isExpanded ? 'utility:chevronright': 'utility:chevrondown';
            
            record.isExpanded = !isExpanded; 

            this.records = [...this.records]; // Garante a reatividade
            
            if (!isExpanded) {
                this.expandedItems = [ ... this.expandedItems, record.id];
            }                
            else {
                // Remove do array se estiver colapsando
                this.expandedItems = this.expandedItems.filter(id => id !== record.id);
            }                       
        }

        console.info(JSON.stringify(this.expandedItems));
    }
}