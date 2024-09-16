# webdigital-api

This package is used to call WebDigital public APIs externally. 

In order to call an API you created in WebDigital from the WebDigital UI, you can use this.callApi on the component client-side JS code. 

If you want to call a WebDigital API externally, you should use this package. It simplifies calling and handles streaming.

```
npm install webdigital-api
import callApi from 'webdigital-api';
try { 
    const { response } = await callApi({ url, apiName, draftId, args, streamCallback });
}
catch (ex) {
    console.error(ex); 
}
```

- URL: the domain of the website. You can use WebDigital default URLs as well. 
- apiName: the name of the API you set in WebDigital when creating the API.
- draftId: draft version of your website to call. Good for development. See your website preview URL for draft ID.
- args: array of the argument values to be sent to the API. Example: [ 'arg1', 'arg2' ]. 
- streamCallback: function to call when data is received. It will be called with full response string received so far. Example: response => renderResponse(response);

