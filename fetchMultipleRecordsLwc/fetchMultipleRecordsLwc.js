import { LightningElement,track,wire } from 'lwc';
import getAccountList from '@salesforce/apex/FetchMultipleRecords.search'

export default class FetchMultipleRecordsLwc extends LightningElement {
    @track accounts;
    @track error;

    @wire(getAccountList)
    wiredAccounts({ error, data }) {
        if (data) {
            this.accounts = data;
            this.error = undefined;
            console.log(this.accounts);
        } else if (error) {
            this.error = error;
            this.accounts = undefined;
        }
    }

}