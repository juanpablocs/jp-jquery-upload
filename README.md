# jp-jquery-upload
npm package jquery upload

##Install
```
npm install --save jp-jquery-upload
```

##Usage
```js
import $ from 'jquery';

$.upload( '/upload', new FormData( $("#formUpload")[0] ))
  .progress( function( progressEvent, upload) {
    if( progressEvent.lengthComputable) {
      var percent = Math.round( progressEvent.loaded * 100 / progressEvent.total);
      if( upload) {
        console.log( percent + '% uploaded');
      } else {
        console.log( percent + '% downloaded');
      }
    }
  })
  .error(function(){
    console.log('error');
  })
  .done( function(res) {


  });
          
```
