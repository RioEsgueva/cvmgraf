function procesar(){
 var txt_json = document.frm_datos_fc.txtarea_datos_fc.value;
 var obj_json = JSON.parse(txt_json);
 //alert("a" + obj_json.fc["tabla_vreal"][1].inicio);
 // Variable donde se escribe.
 var txt_svg = "";
 // Escala de velocidad y distancia
 var max_v = obj_json.fc.max_v;
 var max_d = obj_json.fc.max_d;
 // Márgen izquierdo y derecho
 var mizq = 150;
 var mder = 120;
 // Altura del margen superior, se calcula en función de la leyenda
 var h_leyenda_entrada = 20;
 var num_leyendas = 0;
 for (i in obj_json.fc["tabla_vars"]){
  if(obj_json.fc.tabla_vars[i].leyenda){
   num_leyendas ++;
  }
 }
 var h_leyenda = num_leyendas * h_leyenda_entrada;
 var h_titular = 40;
 var msup = 20 + ((h_titular > h_leyenda) ? h_titular : h_leyenda);
 // Márgen inferior
 var minf = obj_json.fc.minf;
 // Altura y anchura del gráfico
 var hhh = obj_json.fc.alto;
 var www = obj_json.fc.ancho;
 // Altura y anchura del dibujo SVG
 var hhhh = hhh + msup + minf;
 var wwww = www + mizq + mder;




 var tabla_tramos = obj_json.fc.tabla_tramos;
 var tabla_tramos_svg = new Array();
 if (typeof (tabla_tramos) == "undefined") {
   tabla_tramos_svg.push({"inicio_tramo" : 0, "inicio_total" : 0, "fin_tramo" : max_d});
 }else{
   var total_suma = 0;
   for(i=0; i<tabla_tramos.length; i++){
     tabla_tramos_svg.push({"inicio_tramo" : tabla_tramos[i].inicio, "inicio_total" : total_suma, "fin_tramo" : tabla_tramos[i].final});
     total_suma += tabla_tramos[i].final - tabla_tramos[i].inicio;
   }
   max_d = total_suma;
 }
 var tabla_vars_tramos = new Array();
 if (typeof (obj_json.fc.tabla_vars[0].tramo) == "undefined") {
   for(i=0; i<obj_json.fc.tabla_vars.length; i++){
     tabla_vars_tramos.push(0);  // Si no está definida se crea una rellenada con ceros
   }
 }else{
   for(i=0; i<obj_json.fc.tabla_vars.length; i++){
     tabla_vars_tramos.push(obj_json.fc.tabla_vars[i].tramo); // Si está definida se copia
   }
 }
 


 /*var xx = 0; var yy = (200 - 160)*hhh / 200;
 var ww = 1000; var hh = (200 - 160)*hhh / 200;*/
/* txt_svg += "<rect x=" + xx + " y=" + yy + " width=" + ww + " height=" + hh + " class=\"graf_fondo graf_fondo200\" />\n";
 yy = hh;
 hh = (160 - 140)*hhh / 200;
 txt_svg += "<rect x=" + xx + " y=" + yy + " width=" + ww + " height=" + hh + " class=\"graf_fondo graf_fondo160\" />\n";
 //obj_json.fc["tabla_vreal"].inicio.push(max_d);
*/





 txt_svg += " <text x=\"" + (10) + "\" y=\"" + (20) + "\" style=\"font-size:25px\">" + obj_json.fc.titular + "</text>";


// Leyenda
 txt_svg += "<g id=\"leyenda\">";
 xx = 600; yy = 5; ww = 20; hh = h_leyenda_entrada/2;
 for(j=0; j<obj_json.fc["tabla_vars"].length; j++){
  var mosrtrar_en_leyenda = obj_json.fc.tabla_vars[j].leyenda;
  if(mosrtrar_en_leyenda){
   var leyenda_txt = obj_json.fc.tabla_vars[j].texto;
   var leyenda_color = obj_json.fc.tabla_vars[j].color;
   var leyenda_trans = obj_json.fc.tabla_vars[j].trans;
    var leyenda_grosor = obj_json.fc.tabla_vars[j].grosor;
   if(leyenda_grosor == "0"){
    txt_svg += " <rect x=\"" + xx + "\" y=\"" + yy + "\" width=\"" + ww + "\" height=\"" + hh + "\" fill=\"" + leyenda_color + "\" fill-opacity=\"" + leyenda_trans + "\" />\n";
   }else{
    txt_svg += " <line x1=\"" + xx  + "\" y1=\"" + (yy + hh/2) + "\" x2=\"" + (xx + ww) + "\" y2=\"" + (yy + hh/2) + "\" stroke-opacity=\"" + leyenda_trans + "\" stroke-width=\"" + leyenda_grosor + "\" stroke=\"" + leyenda_color + "\" />\n";
   }
   txt_svg += " <text x=\"" + (xx + ww + 5) + "\" y=\"" + (yy + 10) + "\">" + leyenda_txt + "</text>";
   yy += h_leyenda_entrada;
  }
 }
 txt_svg += "</g>";
// txt_svg += txt_leyenda;





// Gráfico

 for(j=0; j<obj_json.fc["tabla_vars"].length; j++){
  var nombre_var = obj_json.fc.tabla_vars[j].tabla;
  var color_var = obj_json.fc.tabla_vars[j].color;
  var trans_var = obj_json.fc.tabla_vars[j].trans;
  var grosor_var = obj_json.fc.tabla_vars[j].grosor;
  var finalizar_var = obj_json.fc.tabla_vars[j].finalizar;
  var tabla_vars_tramos_j = tabla_vars_tramos[j];//(typeof (tabla_vars_tramos[j]) == "undefined") ? 0 : tabla_vars_tramos[j];
  var pos_inicio_x = mizq + tabla_tramos_svg[tabla_vars_tramos_j].inicio_total * www / max_d; // Distancia a sumar de los tramos anteriores
  var pos_inicio_restar = tabla_tramos_svg[tabla_vars_tramos_j].inicio_tramo; // Distancia a restar porque el tramo no empieza en el kilómetro 0

  txt_svg += "  <polyline points=\"";
  if(obj_json.fc[nombre_var].length == 1){
   //xx = pos_inicio_x + (obj_json.fc[nombre_var][i].inicio - pos_inicio_restar) * www / max_d;
   ww = pos_inicio_x + (obj_json.fc[nombre_var][0].inicio - pos_inicio_restar) * www / max_d;
   //yy = msup + hhh - obj_json.fc[nombre_var][i].velocidad * hhh / max_v;
   //txt_svg += xx.toFixed(2) + "," + yy.toFixed(2) + " " + (ww).toFixed(2) + "," + yy.toFixed(2) + " ";
  }else{
   for(i=0; i<obj_json.fc[nombre_var].length - 1; i++){
    xx = pos_inicio_x + (obj_json.fc[nombre_var][i].inicio - pos_inicio_restar) * www / max_d;
    ww = pos_inicio_x + (obj_json.fc[nombre_var][i+1].inicio - pos_inicio_restar) * www / max_d;
    yy = msup + hhh - obj_json.fc[nombre_var][i].velocidad * hhh / max_v;
    txt_svg += xx.toFixed(2) + "," + yy.toFixed(2) + " " + (ww).toFixed(2) + "," + yy.toFixed(2) + " ";
   }
  }
  yy = msup + hhh - obj_json.fc[nombre_var][obj_json.fc[nombre_var].length - 1].velocidad * hhh / max_v;
  var pos_final_x = pos_inicio_x + (    ( (finalizar_var == 0) ? tabla_tramos_svg[tabla_vars_tramos_j].fin_tramo : finalizar_var)    - pos_inicio_restar) * www / max_d;
  txt_svg += (ww).toFixed(2) + "," + yy.toFixed(2) + " " + (pos_final_x).toFixed(2) + "," + yy.toFixed(2) + " ";

  pos_inicio_x += (obj_json.fc[nombre_var][0].inicio - pos_inicio_restar) * www / max_d;
  if(grosor_var == "0"){
   txt_svg += (pos_final_x) + "," + (msup + hhh) + " " + pos_inicio_x + "," + (msup + hhh) + " ";
   txt_svg += "\" fill=\"" + color_var + "\" fill-opacity=\"" + trans_var + "\" />\n";
  }else{
   txt_svg += "\" stroke=\"" + color_var + "\" stroke-opacity=\"" + trans_var + "\" fill=\"none\" stroke-width=\"" + grosor_var + "\" />\n";
  }
 }
// (mizq + www)  pos_final_x
// mizq  pos_inicio_x




// Líneas horizontales
 for(i = 0; i < max_v; i += 20){
   var yy_lineas = msup + hhh - (i * hhh / max_v);
   txt_svg += " <line x1=\"" + mizq  + "\" y1=\"" + yy_lineas + "\" x2=\"" + (mizq + www) + "\" y2=\"" + yy_lineas + "\" stroke-opacity=\"0.25\" stroke-width=\"2\" stroke=\"#500\" />\n";
   txt_svg += " <text x=\"" + (mizq - 30) + "\" y=\"" + (yy_lineas + 5) + "\">" + (i) + "</text>";
 }
   txt_svg += " <line x1=\"" + mizq  + "\" y1=\"" + msup + "\" x2=\"" + (mizq + www) + "\" y2=\"" + msup + "\" stroke-opacity=\"0.25\" stroke-width=\"2\" stroke=\"#500\" />\n";
   txt_svg += " <text x=\"" + (mizq - 30) + "\" y=\"" + (msup + 5) + "\">" + (max_v) + "</text>";





// Líneas verticales


   max_d_svg = max_d / 10000;
   for(j=0; j<tabla_tramos_svg.length; j++){
     var inicio_lineas_v = tabla_tramos_svg[j].inicio_tramo / 10000;
     var final_lineas_v = Math.round((tabla_tramos_svg[j].fin_tramo - tabla_tramos_svg[j].inicio_tramo) / 10000);
     var suma_dist_numeros = Math.ceil((tabla_tramos_svg[j].inicio_tramo) / 10000);
     var xx_lineas_inicial = tabla_tramos_svg[j].inicio_total * www / max_d;
     //inicio_lineas_v *= 10000;
     //alert(inicio_lineas_v + " a " + tabla_tramos_svg[j].inicio_tramo);
     for(i = 1; i<final_lineas_v; i++){
       var xx_lineas = mizq + xx_lineas_inicial - inicio_lineas_v + i * www / max_d_svg;
       txt_svg += " <line x1=\"" + xx_lineas  + "\" y1=\"" + msup + "\" x2=\"" + xx_lineas + "\" y2=\"" + (msup + hhh) + "\" stroke-opacity=\"0.25\" stroke-width=\"2\" stroke=\"#030\" />\n";
       txt_svg += " <text x=\"" + (xx_lineas - 5) + "\" y=\"" + (msup + hhh + 20) + "\">" + ((i + suma_dist_numeros) * 10) + "</text>";
     }
     // Líneas verticales para iniciar cada tramo   alert(tabla_tramos_svg[j].total_suma + " a " + xx_lineas);
     xx_lineas_inicial += mizq;
     //txt_svg += " <line x1=\"" + (xx_lineas_inicial)  + "\" y1=\"" + msup + "\" x2=\"" + (xx_lineas_inicial) + "\" y2=\"" + (msup + hhh) + "\" stroke-opacity=\"0.25\" stroke-width=\"2\" stroke=\"#030\" />\n";
     //txt_svg += " <text x=\"" + (xx_lineas_inicial - 5) + "\" y=\"" + (msup + hhh + 20) + "\">0</text>";
     // Líneas verticales adicionales
     if(typeof (obj_json.fc.tabla_lineas_verticales) != "undefined"){
       for(i = 0; i<obj_json.fc.tabla_lineas_verticales.length; i++){
         if(obj_json.fc.tabla_lineas_verticales[i].tramo == j){
           var xx_lineas = xx_lineas_inicial - inicio_lineas_v + obj_json.fc.tabla_lineas_verticales[i].punto * www / max_d;
           txt_svg += " <line x1=\"" + xx_lineas  + "\" y1=\"" + msup + "\" x2=\"" + xx_lineas + "\" y2=\"" + (msup + hhh) + "\" stroke-opacity=\"0.25\" stroke-width=\"2\" stroke=\"#030\" />\n";
         }
       }
     }
   }
   xx_lineas_inicial += mizq;
   xx_lineas = mizq + www; // Línea vertical para cerrar
   txt_svg += " <line x1=\"" + (xx_lineas)  + "\" y1=\"" + msup + "\" x2=\"" + (xx_lineas) + "\" y2=\"" + (msup + hhh) + "\" stroke-opacity=\"0.25\" stroke-width=\"2\" stroke=\"#030\" />\n";







// Nombres de poblaciones
 if (typeof (obj_json.fc.tabla_vars[0].tramo) == "undefined") { // Formato antiguo (un vector con estructuras de los nombres)
   for(i=0; i<obj_json.fc["tabla_pobl"].length; i++){
     var xx_lineas = mizq + obj_json.fc["tabla_pobl"][i].pos * www / (max_d);
     txt_svg += " <line x1=\"" + xx_lineas  + "\" y1=\"" + (msup + hhh + 33) + "\" x2=\"" + xx_lineas + "\" y2=\"" + (msup + hhh + 23) + "\" class=\"graf_linea_texto\" stroke-width=\"1\" stroke=\"#000\" />\n";
     xx_lineas += obj_json.fc["tabla_pobl"][i].ajuste;
     txt_svg += " <text transform = \"rotate(-90," + (xx_lineas + 3) + "," + (msup + hhh + 35) + ")\" style=\"text-anchor:end;text-align:end\" x=\"" + (xx_lineas + 3) + "\" y=\"" + (msup + hhh + 35) + "\">" + obj_json.fc["tabla_pobl"][i].nombre + "</text>";
   }
 }else{ // Formato nuevo (un vector con vectores (uno por tramo) y cada vector con estructuras para los nombres)
   for(i=0; i<obj_json.fc["tabla_pobl"].length; i++){ // Tramos
     for(j=0; j<obj_json.fc["tabla_pobl"][i].length; j++){ // Poblaciones en cada tramo
       var xx_lineas = mizq + (obj_json.fc["tabla_pobl"][i][j].pos + tabla_tramos_svg[i].inicio_total - tabla_tramos_svg[i].inicio_tramo) * www / (max_d);
       txt_svg += " <line x1=\"" + xx_lineas  + "\" y1=\"" + (msup + hhh + 33) + "\" x2=\"" + xx_lineas + "\" y2=\"" + (msup + hhh + 23) + "\" class=\"graf_linea_texto\" stroke-width=\"1\" stroke=\"#000\" />\n";
       xx_lineas += obj_json.fc["tabla_pobl"][i][j].ajuste;
       txt_svg += " <text transform = \"rotate(-90," + (xx_lineas + 3) + "," + (msup + hhh + 35) + ")\" style=\"text-anchor:end;text-align:end\" x=\"" + (xx_lineas + 3) + "\" y=\"" + (msup + hhh + 35) + "\">" + obj_json.fc["tabla_pobl"][i][j].nombre + "</text>";
     }
   }
 }




 //alert("a" + hhhh);
 document.getElementById('vel').innerHTML = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"" + wwww + "px\" height=\"" + hhhh + "px\">\n" + txt_svg + "</svg>"; // <br>a
 document.frm_svg_fc.txtarea_svg_fc.value = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"" + wwww + "px\" height=\"" + hhhh + "px\">\n" + txt_svg + "</svg>"; // <br>a
}





function cargar_ruta(fichero){
 var xmlhttp;
 if (window.XMLHttpRequest){   // code for IE7+, Firefox, Chrome, Opera, Safari
  xmlhttp=new XMLHttpRequest();
 }else{// code for IE6, IE5
  xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
 }
 xmlhttp.onreadystatechange=function(){
  if (xmlhttp.readyState==4 && xmlhttp.status==200){
   document.frm_datos_fc.txtarea_datos_fc.value = xmlhttp.responseText; // document.getElementById("vel").innerHTML
   procesar();
  }
 }
 xmlhttp.open("GET", fichero, true);
 xmlhttp.send();
}



/*
var xmlhttp = new XMLHttpRequest();
var url = "ffcc_json.txt";


xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
        var myArr = JSON.parse(xmlhttp.responseText);
        myFunction(myArr);
    }
}
xmlhttp.open("GET", url, true);
xmlhttp.send();

function myFunction(arr) {
    var out = "";
    var i;
    for(i = 0; i < arr.length; i++) {
        out += '<br>';   //   velocidad[i].inicio +   alert("pwn"); out += velocidad[i].inicio + <br>';
    }
    document.frm_datos_fc.txtarea_datos_fc.value = out; //document.getElementById("vel").innerHTML
}
*/