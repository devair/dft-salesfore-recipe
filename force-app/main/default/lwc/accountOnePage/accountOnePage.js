import { LightningElement, api, track } from 'lwc';
import { log } from 'lightning/logger';
import { pedidos, colunasPedido, colunasItem, itensPedido, colunasNota} from './dataSamples';

export default class AccountOnePage extends LightningElement {

    @api recordId;
    objectApiName = 'Account';

    recordData;

    connectedCallback(){
        console.log(this.recordId);
        this.recordData = {
            Id: this.recordId,
            Name: 'Conta 1',
            LastUpdate: '2025-02-12'
        }
    }

    handleDetailsClick(event) {
        let msg = {
            type: "click",
            action: "Details"
        }
        log(msg);
    }

    @track records = itensPedido();
    columns = colunasItem();
    columnsChildren = colunasNota();
}