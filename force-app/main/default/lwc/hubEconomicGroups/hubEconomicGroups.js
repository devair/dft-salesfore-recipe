import { LightningElement, wire, track } from 'lwc';
import getAccountsWithChildren from '@salesforce/apex/AccountContactController.getAccountsWithChildren';
import { NavigationMixin } from 'lightning/navigation';
import FORM_FACTOR from '@salesforce/client/formFactor';
import { refreshApex } from "@salesforce/apex";

const COLUMNS = [    
    { 
        label: 'Nome', 
        fieldName: 'recordUrl', 
        type: 'url',         
        typeAttributes: { 
            label: { fieldName: 'name' }, 
            target: '_self',        
        }
    },
    { label: 'Telefone', fieldName: 'phone', type: 'phone'        
    },
    { label: 'Status', fieldName: 'status', type: 'text',
        cellAttributes: {
            iconName: { fieldName: 'statusIcon'},
            iconStyle: { fieldName: 'statusIconClass'},
            iconPosition: 'left',                   
        },
    },
    { 
        label: 'Web Site', 
        fieldName: 'webSite', 
        type: 'url', 
        typeAttributes: { 
            label: { fieldName: 'webSite' }, 
            target: '_self',        
        } 
    },
    { 
        label: 'Pedidos em Carteira', 
        fieldName: 'backlogOrders', 
        type: 'link' 
    },     
    { label: 'Valor', fieldName: 'backlogOrders', type: 'currency',        
        cellAttributes: {
            currencyCode: { fieldName: 'currencyCode'} , 
            currencyDisplayAs: 'symbol',              
        }
    },                      
    { 
        label: 'One Page', 
        fieldName: 'onePage',            
        type: 'button-icon', 
        cellAttributes: {             
            iconName: { fieldName: 'onePageIcon' },            
            iconVariant: {fieldName: 'onePageIconVariant'}
        }        
    }           
];


export default class HubEconomicGroups extends NavigationMixin(LightningElement) {
    @track treeData = [];    
    @track searchTerm ='';
    @track offset = 0;
    @track hasMoreData = true;

    isMobile = FORM_FACTOR === 'Small';    
    columns = COLUMNS;
    
    activeSections = [];

    @track mainRecords;
        
    searchTimeout;
    

    
    @wire(getAccountsWithChildren, { searchTerm: '$searchTerm'})
    wiredAccounts({ error, data }) {
        if (data) {            
            //this.treeData = this.formatTreeData(data);     
            this.mainRecords = this.formatDataGrid(data);                        
            
        } else if (error) {
            console.error('Erro ao carregar contas:', error);            
        }        
    }

/*
    formatTreeData(accounts) {
        
        let treeData = accounts.map(account => ({
            id: account.id,
            name: account.name,                
            phone: account.phone,
            status: account.status,  
            recordUrl: `/${account.id}`,
            parentId: account.id,            
            webSite: account.webSite,
            _children: account.children?.map(child => ({
                id: child.id,
                name: child.name,
                phone: child.phone,
                status: child.status,
                recordUrl: `/${child.id}`,
                parentId: child.parentId,
                parentUrl: `/${account.id}`,
                parentName: account.name,      
                webSite: child.webSite                
            }))
        }));
        
        return treeData;
    }
*/
    
    formatDataGrid(accounts) {
        
        const columns = COLUMNS;

        const data = accounts.map(account => 
            {                               
                const root = {                
                    id: account.id,
                    name: account.name,                
                    phone: account.phone,
                    status: account.status,  
                    recordUrl: `/${account.id}`,
                    parentId: account.id,
                    buttonVisibility: '',
                    status: account.status,           
                    webSite: account.webSite,
                    backlogOrders: account.backlogOrders,
                    currencyCode: account.currencyCode,
                    backlogOrdersUrl: `/${account.id}`,
                    statusIcon: account.statusIcon,
                    statusIconClass: account.statusIconClass,                    
                    onePageIcon: 'utility:company',
                    onePageIconVariant: 'bare'
                }

                const processedChildren = (children) => {

                    const dataChild = children.map(child => (
                        {
                            id: child.id,
                            name: child.name,
                            phone: child.phone,
                            status: child.status,
                            recordUrl: `/${child.id}`,
                            parentId: child.parentId,
                            status: child.status,
                            parentUrl: `/${account.id}`,
                            parentName: account.name,     
                            backlogOrders: child.backlogOrders,
                            currencyCode: child.currencyCode,
                            webSite: child.webSite,
                            statusIcon: child.statusIcon,
                            statusIconClass: child.statusIconClass,
                            onePageIcon: '',
                            onePageIconVariant: 'bare'
                        })                            
                    );

                    let childReturn;
                    if(dataChild){
                        childReturn = {
                            columns: columns, data: dataChild
                        }
                    }

                    return  childReturn;                    
                }; 
                
                return {
                    ...root,
                    children: account?.children ? processedChildren(account.children) : undefined
                }
            }         
        )        
        const formattedData = { columns: columns, data: data};        
        return formattedData;                
    }

    handleSearchChange(event){
        const searchTerm = event.target.value;
        this.searchTerm = searchTerm;
        
        // Limpando o timeout anterior se o usuário continuar digitando
        clearTimeout(this.searchTimeout);

        // Aplicando debounce de 500ms
        this.searchTimeout = setTimeout(async () => {
            await refreshApex(this.wiredAccounts);              
            this.handleRefreshDataGrid(this.searchTerm ? true : false);                                  
        }, 500);
    }

    handleRefreshDataGrid(expanded) {
        const childComponent = this.template.querySelector('c-data-grid');
        if (childComponent) {
            childComponent.refreshData(expanded); // Chamando o método público do filho
        }


        const childComponentTeporario = this.template.querySelector('c-dynamic-html-table');
        if (childComponentTeporario) {
            childComponentTeporario.refreshData(expanded); // Chamando o método público do filho
        }        
    }



    navigateToPage(event) {
        const { recordId, fieldName } = event.detail;
        
        let direction
        let encodeDef

        switch (fieldName) {            
            case 'onePage':

                direction = {
                    componentDef: 'c:accountOnePage', 
                    attributes: {
                        recordId: recordId
                    }               
                }
    
                encodeDef = btoa(JSON.stringify(direction));
    
                this[NavigationMixin.Navigate]({
                    type: 'standard__webPage',
                    attributes: {url: '/one/one.app#'+encodeDef}
                });

                break;

            case 'backlogOrders':

                direction = {
                    componentDef: 'c:orderOnePage', 
                    attributes: {
                        recordId: recordId
                    }               
                }
    
                encodeDef = btoa(JSON.stringify(direction));
    
                this[NavigationMixin.Navigate]({
                    type: 'standard__webPage',
                    attributes: {url: '/one/one.app#'+encodeDef}
                });

                break;
        
            default:
                break;
        }
    }
}