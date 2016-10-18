# jp-jquery-upload
npm package jquery upload

##Install
```
npm install --save jp-jquery-upload
```

##Usage
```js
import $ from 'jquery';
import upload from 'jp-jquery-upload';

$.upload( '/upload.php', new FormData( $("#formUpload")[0] ))
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
  .fail(function(){
    console.log('error');
  })
  .done( function(res) {
    console.log('successfull');
  });
          
```
