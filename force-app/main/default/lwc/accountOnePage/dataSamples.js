
export function itensPedido() {
    return [
        {            
            id: 11,
            produto: 'PRODUTO 1',
            quantidade: 1200,
            qtdFaturada: 1200,
            qtdDisponivel: 0,
            entrega: '2025-12-31',
            tipo: 'Item Filho',
            valor: 7500,
            pagamento: '15 DDL',
            status: 'Faturado',
            children: {
                columns: colunasNfItemMae() ,    
                data: [
                    { 
                        id: 222,                        
                        serie: '000000001-001',
                        emissao: '2025-02-13',
                        valor: 2500
                    },           
                ]     
            }  
        }    
    ];
}

export function colunasItem(){
    return [
            {label: 'Produto', fieldName: 'produto', type: 'text'},
            {label: 'Quantidade', fieldName: 'quantidade', type: 'number'},
            {label: 'Qtd. Faturada', fieldName: 'qtdFaturada', type: 'number'},
            {label: 'Qtd. Disponível', fieldName: 'qtdDisponivel', type: 'number'},
            {label: 'Entrega', fieldName: 'entrega', type: 'date'},
            {label: 'Valor', fieldName: 'valor', type: 'currency'},
            {label: 'Pagamento', fieldName: 'pagamento', type: 'text'},
            {label: 'Status', fieldName: 'status', type: 'text'}     
    ];    
}

export function colunasItemMae(){
    return [
            {label: 'Produto', fieldName: 'produto', type: 'text'},
            {label: 'Quantidade', fieldName: 'quantidade', type: 'number'},
            {label: 'Qtd. Desmembrada', fieldName: 'qtdDesmembrada', type: 'number'},
            {label: 'Saldo a Desmembrar', fieldName: 'saldoDesmembrar', type: 'number'},
            {label: 'Cadencia Entrega', fieldName: 'cadenciaEntrada', type: 'text'},
            {label: 'Valor', fieldName: 'valor', type: 'currency'},            
            {label: 'Status', fieldName: 'status', type: 'text'}     
    ];    
}


export function colunasNfItemMae(){
    return [                
        {label: 'Série', fieldName: 'serie', type: 'text'},        
        {label: 'Emissão', fieldName: 'emissao', type: 'date'},        
        {label: 'Fazenda', fieldName: 'fazenda', type: 'text'},        
        {label: 'Qtd. Faturada', fieldName: 'qtdFaturada', type: 'number'},
        {label: 'Vlr Unitário', fieldName: 'valorUnitario', type: 'currency'},
        {label: 'Vlr Total', fieldName: 'valorTotal', type: 'currency'}     
    ];
   
}

export function colunasPedidoFilhoMae(){
    return [
        {label: 'Pedido', fieldName: 'numero', type: 'text'},        
        {label: 'Contrato SAP', fieldName: 'contratoSap', type: 'text'},        
        {label: 'Fazenda', fieldName: 'fazenda', type: 'text'},        
        {label: 'Tipo de Pedido', fieldName: 'tipo', type: 'text'},        
        {label: 'Quantidade', fieldName: 'quantidade', type: 'number'},        
        {label: 'Qtd. Faturada', fieldName: 'qtdFaturada', type: 'number'},                
        {label: 'Status', fieldName: 'status', type: 'text'},        
    ]
}

export function colunasPedido(){
    return [
        {label: 'Pedido', fieldName: 'numero', type: 'text'},        
        {label: 'Fazenda', fieldName: 'fazenda', type: 'text'},        
        {label: 'Segmento', fieldName: 'segmento', type: 'text'},        
        {label: 'Tipo de Pedido', fieldName: 'tipo', type: 'text'},        
        {label: 'Tipo de Pgto', fieldName: 'tipoPgto', type: 'text'},        
        {label: 'Valor', fieldName: 'valor', type: 'currency'},        
        {label: 'Pagamento', fieldName: 'pagamento', type: 'text'},        
        {label: 'Status', fieldName: 'status', type: 'text'},        
    ]
}


export function pedidos(){
    return {
        data: [ ...pedidosMae(), ...pedidosNormal()],
        columns: colunasPedido()
    }
}

export function pedidosNormal(){
    return [
        {
            id: 1010,            
            numero: '4444',
            fazenda: 'Fazenda',
            segmento: 'Segmento',
            tipo: 'Normal',
            tipoPgto: 'Cash',
            valor: 7500,            
            pagamento: '30 DDL',
            status: 'Aprovado', 
            levelType : 'itemMae',           
            children : { 
                columns: colunasItem(),
                data: itensPedido()            
            }           
        }
     ]        
}



export function pedidosMae() {
    return [
        {
            id: 100,            
            numero: '0123',
            fazenda: 'Fazenda',
            segmento: 'Segmento',
            tipo: 'Mae',
            tipoPgto: 'Cash',
            valor: 7500,            
            pagamento: '30 DDL',
            status: 'Aprovado', 
            levelType : 'itemMae',           
            children : { 
                columns: colunasItemMae(),
                data: itensPedidoMae()            
            }           
        }
    ]
}

export function itensPedidoMae(){
    return [
        {            
            id: 110,
            produto: 'PRODUTO 3',
            quantidade: 1200,
            qtdDesmembrada: 0,
            saldoDesmembrar: 0,
            cadenciaEntrada: '12/08/2024 - 12/09/2024',
            valor: 7500,            
            status: 'Pendente',
            levelType : 'itemMae',
            children: {
                columns: colunasPedidoFilhoMae(),
                data: pedidosFilhoMae()
            }
        }
    ];
}

export function pedidosFilhoMae() {
    return [       
        {                        
            id: 1,            
            numero: '123',            
            contratoSap: '000008081',
            fazenda: 'Fazenda',
            tipo: 'Normal', 
            quantidade: 7500,
            qtdFaturada: 7500,
            status: 'Aprovado',
            levelType : 'itemMae',           
            children : { 
                columns: colunasNfItemMae(),
                data: itensNfMae()            
            }
        }        
    ];
}

export function itensNfMae(){
    return [
        {
            id: 1111,
            serie: '000001-001',
            emissao: '2024-12-31',
            fazenda: 'Fazenda',
            qtdFaturada: 7500,
            valorUnitario: 1,
            valorTotal: 7500,
            levelType : 'itemMae'
        }
    ]
}



