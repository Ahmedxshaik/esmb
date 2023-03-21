import { LightningElement, api,wire, track } from 'lwc';
import getQuoteMetadata from '@salesforce/apex/SendDataPDF.getQuoteMetadata';
import sendToVF from'@salesforce/apex/SendDataPDF.sendToVF';

export default class IncreaseWidthOfModalBoxInLWC extends LightningElement {
    @track isModalOpen = true;
    @track items = [];
    @api recordId;
@track metaaId;
    @track quotesId;


    openModal() {
        // to open modal set isModalOpen tarck value as true
        this.isModalOpen = true;
    }
    closeModal() {
        // to close modal set isModalOpen tarck value as false
        this.isModalOpen = false;
    }
    submitDetails() {
      this.quotesId=this.recordId;
        // to close modal set isModalOpen tarck value as false
        //Add your code to call apex method or do some processing
        sendToVF({metaId:this.metaaId,QuoteId:this.quotesId})
        .then(result => {
          var baseUrl= decodeURIComponent(window.location.hostname);
          var url = ' https://'+baseUrl+'/apex/CreatePDF?id=' + this.recordId;
          window.open(url);
          this.isModalOpen = false;
         })
        .catch(error => {
          this.isModalOpen = false;
        this.error = error;
        });
        
       
    }



    @wire(getQuoteMetadata)
    QuoteMetadataList({error, data})
    {
      if(data)
      {
        var i;
        for(i=0; i<data.length; i++) 
        {
         this.items = [...this.items,{value: data[i].Id , label: data[i].DeveloperName}];                                   
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
    
    Options(event) 
    {
      this.metaaId=event.detail.value;
      alert(this.metaaId);  
      
  }

}