/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */




$(document).ready(function () {


    $('input[name=photo]').change(function (e) {
        var file = e.target.files[0];


        // CANVAS RESIZING
        canvasResize(file, {
            width: 800,
            height: 0,
            crop: false,
            quality: 70,
            rotate: 0,
            callback: function (data, width, height) {


                $("#hidden").attr('value', data);
                $("body").append(data);
                alert(data);
                var image = document.getElementById('myImage');
                image.src = data;


            }
        });
    });



    $("#camera").click(function () {
        navigator.camera.getPicture(onSuccess, onFail, {
            destinationType: Camera.DestinationType.DATA_URL,
            sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
            quality: 50,
            correctOrientation: true,
            encodingType: Camera.EncodingType.JPEG
        });
    });



    function onSuccess(imageURI) {
        alert("success");
        $("body").append(imageURI);
        alert(imageURI);
        var image = document.getElementById('myImage');
        image.src = imageURI;
    }

    function onFail(message) {
        alert('Failed because: ' + message);
    }

});
   