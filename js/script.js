
var code;
//code = "123 log 456 log 789 print ";
//code = "1 + 3 log 2 - 3 log ";
//code = "3.5 yint log sqrt 100 log rand 1 50 log  ";
//code = "var a    1 ! a    @ a log     @ a + 1 ! a   @ a log     a log     ";
//code = " ' test' log   var s    \" foo bar\" ! s    @ s log ";
//code = "/* comment*/ ' test' log  // cyfkjvbl gvhkbj \n";
//code = " def bla  123 log 4 log end bla  bla"
//code = " ytst ( 1,2) ' |' log ytstargpop ( 1,' aaa',0.5, 1 + 5)"
//code = "def bla2 get_args next_arg log next_arg log end  bla2 ( 1 + 1,' foo bar')"
//code ="var xt  7 ! xt   var z  0 ! z   loop ( @ xt,i) {  @ z + @ i ! z @ i log }  @ z log  "
//code =" if ( 1 < 2) { ' true' log}  var a   3 > 2 ! a  if ( 1 < 2 and @ a ) { ' bla' log} else { ' else' log }"
//code =" var tstr [ ] ! tstr @ tstr log  @ tstr rpush 2  @ tstr rpush 10  @ tstr log @ tstr ritem 2 log"
code ="var curitem var arrsum var arr [ 11,22,33,44] ! arr loopr ( @ arr,i) { ! curitem @ curitem YINT + @ arrsum ! arrsum @ i log }"
code += " ' array sum is: ' log  @ arrsum log";

i = new interpreter();
i.add_words(PrintingWords);
i.add_words(MathWords);
i.add_words(VariableWords);
i.add_words(StringWords);
i.add_words(CommentWords);
i.add_words(functionWords);
i.add_words(loopWords);
i.add_words(controlWords);
i.add_words(arrayWords);
i.add_words(consoleWords);

i.run(code)

let root=document.getElementById("root");

let cmd=new Console(root);

i.cmd = cmd;

i.run(hamurabi);

/*
var l = new lexer(code)
 
console.log(l.next_word());
console.log(l.next_word());
console.log(l.next_word());
console.log(l.is_next_char("{"));
console.log(l.next_chars_up_to("}"));
*/