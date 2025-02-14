
export function itensPedido() {
    return [
        {
            isExpanded : false,
            icon: 'utility:chevronright',
            id: 1,
            produto: 'PRODUTO 1',
            quantidade: 1200,
            qtdFaturada: 1200,
            qtdDisponível: 0,
            entrega: '2025-12-31',
            valor: 7500,
            pagamento: '15 DDL',
            status: 'Faturado',
            children: [
                { 
                    id: 1,
                    numero: '000000001-001',
                    emissao: '2025-02-13',
                    valor: 2500
                },
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
                    id: 4,
                    numero: 456,
                    emissao: '2025-01-13',
                    valor: 1000
                },
                { 
                    id: 5,
                    numero: 456,
                    emissao: '2025-01-13',
                    valor: 1000
                },
                { 
                    id: 6,
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
}

export function colunasItem(){
    return [
            {label: 'Produto', fieldName: 'produto', type: 'text'},
            {label: 'Quantidade', fieldName: 'quantidade', type: 'number'},
            {label: 'Qtd. Faturada', fieldName: 'qtdfaturada', type: 'number'},
            {label: 'Qtd. Disponível', fieldName: 'qtddisponivel', type: 'number'},
            {label: 'Entrega', fieldName: 'entrega', type: 'date'},
            {label: 'Valor', fieldName: 'valor', type: 'decimal'},
            {label: 'Pagamento', fieldName: 'pagamento', type: 'text'},
            {label: 'Status', fieldName: 'status', type: 'text'}     
    ];    
}

export function colunasNota(){
    return [                
        {label: 'Número', fieldName: 'numero', type: 'text'},
        {label: 'Emissão', fieldName: 'emissao', type: 'date'},
        {label: 'Valor', fieldName: 'valor', type: 'decimal'}     
    ];
   
}

export function colunasPedido(){
    return [
        {label: 'Número', fieldName: 'numero', type: 'text'},
        {label: 'Emissão', fieldName: 'emissao', type: 'date'},
        {label: 'Valor', fieldName: 'valor', type: 'decimal'},
        {
            type: 'action',
            typeAttributes: { rowActions: [{ label: 'Show details', name: 'show_details' }] },
        },        
    ]
}


export function pedidos() {
    return [
        {
            isExpanded : false,
            icon: 'utility:chevronright',
            id: 1,            
            numero: '123',
            emissao: '2025-12-31',
            valor: 7500,            
            children : itensPedido(),
            expanded: `expanded-1`
        },
        {
            isExpanded : false,
            icon: 'utility:chevronright',
            id: 2,            
            numero: '3333',
            emissao: '2025-12-31',
            valor: 75000,            
            children : itensPedido(),
            expanded: `expanded-2`
        }
    ];
}
