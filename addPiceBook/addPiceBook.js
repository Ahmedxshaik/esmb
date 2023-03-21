import { LightningElement, api,wire, track } from 'lwc';
import getAllPricebooks from '@salesforce/apex/AddPriceBook.getAllPricebooks';
import getAllCurrency from '@salesforce/apex/AddPriceBook.getAllCurrency';



export default class IncreaseWidthOfModalBoxInLWC extends LightningElement {
    @track isModalOpen = false;
    @track items = [];
    @track items1 = [];
    @api recordId;
    @track metaaId;
    @track quotesId;
    @track diabledButton=true;
    @track modalopen=true;

    closeQuickAction() {
        this.modalopen=false;
        const closeQA = new CustomEvent('close');
        // Dispatches the event.
        this.dispatchEvent(closeQA);
    }
    submitDetails() 
    {
      this.quotesId=this.recordId;
      this.diabledButton=true;
        // to close modal set isModalOpen tarck value as false
        //Add your code to call apex method or do some processing
      
          var baseUrl= decodeURIComponent(window.location.hostname);
          var url = ' https://'+baseUrl+'/lightning/o/PricebookEntry__c/new?defaultFieldValues=Pricebook2Id__c=a0E0w0000033EynEAE,Product2Id__c='+this.recordId+',ListPrice__c=12'
          window.open(url);
          this.closeQuickAction();
       
    }



    @wire(getAllPricebooks)
    getAllPricebooks({error, data})
    {
      if(data)
      {
        var i;
        for(i=0; i<data.length; i++) 
        {
         this.items = [...this.items,{value: data[i].Id , label: data[i].Name}];                                   
        }                
        this.error = undefined;
      }
      else if(error)
      {
          this.error=error;
      }
    }

    get handleOptionSelected()
    {
     
        return this.items;
    }
    @wire(getAllCurrency)
    getAllCurrenc({error, data})
    {
      if(data)
      {
        var i;
        for(i=0; i<data.length; i++) 
        {
         this.items1 = [...this.items1,{value: data[i].Id , label: data[i].CurrencyIsoCode}];                                   
        }                
        this.error = undefined;
      }
      else if(error)
      {
          this.error=error;
      }
    }
    get handleOptionSelected1() 
    {
      return this.items1;
    }
    Options(event) 
    {
      this.metaaId=event.detail.value;
      this.diabledButton=false;
    }
    Options1(event) 
    {
    }

}