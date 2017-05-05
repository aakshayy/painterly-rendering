$(function() {
    var handle = $("#layers");
    $("#slider-layers").slider({
        create: function() {
            handle.text($(this).slider("value"));
        },
        max: 5,
        min: 1,
        value: 4,
        slide: function(event, ui) {
            handle.text(ui.value);
            for (var i = 1; i <= ui.value; i++) {
                $("#controlBrush"+i).show();
            }
            for (var i = ui.value + 1; i <= 5; i++) {
                $("#controlBrush"+i).hide();
            }
            changeNumberOfLayers(ui.value);
        }
    });
    $("#controlBrush5").hide();
});
$(function() {
    var handle = $("#alpha");
    $("#slider-alpha").slider({
        create: function() {
            handle.text($(this).slider("value"));
        },
        max: 1.0,
        min: 0.0,
        step: 0.1,
        value: 1.0,
        slide: function(event, ui) {
            handle.text(ui.value);
            changeAlpha(ui.value);
        }
    });
});
$(function() {
    var handle = $("#threshold");
    $("#slider-threshold").slider({
        create: function() {
            handle.text($(this).slider("value"));
        },
        max: 50,
        min: 0,
        step: 5,
        value: 25,
        slide: function(event, ui) {
            handle.text(ui.value);
            changeThreshold(ui.value);
        }
    });
});
$(function() {
    $("#strokeLength").slider({
        range: true,
        min: 1,
        max: 16,
        values: [4, 12],
        slide: function( event, ui ) {
            $("#amount").text(ui.values[0] + " - " + ui.values[1]);
            changeStrokeLength(ui.values[0], ui.values[1]);
        }
    });
    $("#amount").text($("#strokeLength").slider("values", 0) + " - " + $("#strokeLength").slider("values", 1));
});
$(function() {
    function updateBrushSize(event, ui) {
        changeBrushSize(parseInt(ui.item.element[0].parentNode.id[5] - 1), parseInt(ui.item.value));
    }
    $("#brush1").selectmenu({change: updateBrushSize});
    $("#brush2").selectmenu({change: updateBrushSize});
    $("#brush3").selectmenu({change: updateBrushSize});
    $("#brush4").selectmenu({change: updateBrushSize});
    $("#brush5").selectmenu({change: updateBrushSize});
});