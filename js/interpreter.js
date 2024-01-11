class interpreter
{
	constructor() {
		this.dictionary = {};
		this.stack = [];
	}//end constructor
	
	add_words(newDict)
	{
		var t = this;
		for(var word in newDict){t.dictionary[word.toUpperCase()] = newDict[word]}
	}//end add_words
	
	run(code)
	{
		var t = this;
		
		var word,wordc;
		
		t.l = new lexer(code);
		
		while(true)
		{
			if(t.stop){break;}
			
			word = t.l.next_word();
			if(!word){break;}
			
			wordc = t.compile(word);
			t.interpet(wordc);
			
		}
		//console.log(t.l.words)
		
	}//end run
	
	compile(w)
	{
		if(!w){return}
		var t = this;
		w = w.toUpperCase();
		
		var num_val = parseFloat(w);
		
		if(t.dictionary[w]){return t.dictionary[w]}
		else if(!isNaN(num_val)){return num_val}
		else
		{
			console.log(w+" unknown word");
			throw "unknown word";
		}
		
		
	}//end compile
	
	interpet(w)
	{
		var t = this;
		
		if(typeof w === "function")
		{
			if(t.l.is_next_char("(")){t.get_next_word_val();}
			w(t);
		}else
		{
			t.stack.push(w);
		}
		
	}//end interpet
	
	
	get_next_word_val()
	{
		var t = this;
		t.interpet(t.compile(t.l.next_word()));
		return t.stack.pop();
	}//end get_next_word_val

	run_single_word(code)
	{
		var t = this;
		t.interpet(t.compile(code));
		return t.stack.pop();
	}
	
	run_words(code)
	{
		var t = this;
		var old_lexer = t.l;
		t.run(code);
		t.l = old_lexer;
		return t.stack.pop();
	}
	
	define(word,code){this.dictionary[word.toUpperCase()] = code}
	

	get_args()
	{
		this.args = this.args.split(",");
		return this.args;
	}//end get_args
	
	
	get_args_bool()
	{
		var t = this;
		var ret  = t.run_words(t.args);
		return ret;
	}//end get_args_bool
	
	next_arg()
	{
		var words = this.args.next();
		if(!words){return;}
		return this.run_words(words)
	}
	

	
}//end interpreter


var make_variable = (terp)=>
{
	var variable = {value:0};
	
	return () =>
	{
		terp.stack.push(variable);
	}
	
};//end make_variable


var make_word = (code)=> {
    return (terp) => { 
		terp.l.append_after_next(code);
	};
};//end make_word


var PrintingWords = 
{
	"LOG":(terp)=>
	{
		var p = terp.stack.pop();
		console.log(p);
	},
	"PRINT":(terp)=>
	{
		var selecror = document.querySelector("#root");
		var p = terp.stack.pop();
		selecror.innerHTML = p;
	}
}//end PrintingWords

var MathWords = 
{
	"+":(terp)=>
	{
		var val1 = terp.stack.pop();
		var val2 = terp.get_next_word_val();
		terp.stack.push(val1+val2);
	},
	"-":(terp)=>
	{
		var val1 = terp.stack.pop();
		var val2 = terp.get_next_word_val();
		terp.stack.push(val1-val2);
	},
	"*":(terp)=>
	{
		var val1 = terp.stack.pop();
		var val2 = terp.get_next_word_val();
		terp.stack.push(val1*val2);
	},
	"/":(terp)=>
	{
		var val1 = terp.stack.pop();
		var val2 = terp.get_next_word_val();
		terp.stack.push(val1/val2);
	},
	"SQRT":(terp)=>
	{
		var val = terp.get_next_word_val();
		terp.stack.push(Math.sqrt(val));
	},
	"RAND":(terp)=>
	{
		var min = terp.get_next_word_val();
		var max =  terp.get_next_word_val();
		terp.stack.push(Math.floor(Math.random()*(max-min) + min));
	},
	"YINT":(terp)=>
	{
		val = parseInt(terp.stack.pop());
		terp.stack.push(val);
	},


	
}//end MathWords

var VariableWords = 
{
	"VAR":(terp)=>
	{
		var var_name = terp.l.next_word();
		
		terp.define(var_name,make_variable(terp));
	},
	"STORE":(terp)=>
	{
		var refrence = terp.get_next_word_val();
		
		var new_value = terp.stack.pop();
		
		refrence.value = new_value;
	},
	"FETCH":(terp)=>
	{
		var refrence = terp.get_next_word_val();
		terp.stack.push(refrence.value)
	},
}//end VariableWords

VariableWords['!']= VariableWords['STORE'];
VariableWords['@']= VariableWords['FETCH'];

var StringWords = 
{
	"\"":(terp)=>
	{
		var str = terp.l.next_chars_up_to("\"");
		terp.stack.push(str);
	},
	"\'":(terp)=>
	{	
		var str = terp.l.next_chars_up_to("\'");
		terp.stack.push(str);
	},
};//end StringWords

var CommentWords = {
	"/*": (terp) =>{
		
		var end = "\*\/"; // */
		terp.l.next_chars_up_to_word(end);
		
	},

	"//":(terp) =>{
		terp.l.next_chars_up_to("\n");
	}
};


var functionWords = 
{
	
	"DEF":(terp) => 
	{
		

		var newWord = terp.l.next_word();
		var code = terp.l.next_chars_up_to_word("end");
		terp.define(newWord, make_word(code))

		
	},
	"END":(terp) => {},
	"(":(terp) => 
	{
		terp.args = terp.l.next_chars_up_to(")");
	},
	"{":(terp) => 
	{
		terp.execute = terp.l.next_chars_up_to("}");
	},
	"get_args":(terp)=>{terp.get_args();},
	"next_arg":(terp)=>
	{
	  var narg = terp.next_arg();
	  terp.stack.push(narg);
	},
	"ytst":(terp)=>
	{
		var args = terp.get_args();
		console.log(args);
		console.log(parseFloat(args[0])+parseFloat(args[1]));
	},
	"ytstargpop":(terp)=>
	{
		var args = terp.get_args();
		while( bla = terp.next_arg()){console.log(bla)}
	},
	
	
	
};//end functionWords

//loop ( 2,agtuli) { bujbk + inc_script} 
var loopWords = 
{
	"loop":(terp)=>{
		args = terp.get_args();
		var times = terp.run_words(args[0]);
		var iterator_var_name = args[1]
		var inc_script =" @ a + 1 ! a";
		if(iterator_var_name)
		{
			terp.define(iterator_var_name, make_variable(terp))
			inc_script =" @ "+iterator_var_name+" + 1 ! "+iterator_var_name;
		}
		
		terp.get_next_word_val();//get execute
		var code = "";
		
		for(var i =0; i<times;i++){code+= " "+terp.execute+" "+inc_script;}
		terp.l.append_after_next(code);
		
	},
	
	"loopr":(terp)=>
	{
		args = terp.get_args();
		var array = terp.run_words(args[0]);
		var iterator_var_name = args[1]
		var inc_script =" @ a + 1 ! a";
		var times = array.length-1;
		if(iterator_var_name)
		{
			terp.define(iterator_var_name, make_variable(terp))
			inc_script =" @ "+iterator_var_name+" + 1 ! "+iterator_var_name;
		}
		
		terp.get_next_word_val();//get execute
		var code = "";
		
		for(var i =0; i<=times;i++)
		{
			terp.stack.push(array[i]);
			code+= " "+terp.execute+" "+inc_script;
		}
		terp.l.append_after_next(code);
		
	}
}




var controlWords = 
{
	"TRUE": function (terp) { terp.stack.push(true); },
	"FALSE": function (terp) { terp.stack.push(false); },

	"if":(terp)=>{
		var args = terp.get_args_bool()
		terp.get_next_word_val()//get execute
		if(args){terp.l.append_after_next(terp.execute)}
		else{terp.stack.push("do_else")}
	},
	"else":(terp)=>{
		if(terp.stack.pop()!="do_else"){return;}
		terp.get_next_word_val()//get execute
		terp.l.append_after_next(terp.execute)
	},
	
	"<":(terp)=> {
		var term1 = terp.stack.pop();
		var term2 = terp.get_next_word_val();
		terp.stack.push(term1 < term2);
	},
	"<=":(terp)=> {
		var term1 = terp.stack.pop();
		var term2 = terp.get_next_word_val();
		terp.stack.push(term1 <= term2);
	},
	"==":(terp)=> {
		var term1 = terp.stack.pop();
		var term2 = terp.get_next_word_val();
		terp.stack.push(term1 == term2);
	},
	">=":(terp)=> {
		var term1 = terp.stack.pop();
		var term2 = terp.get_next_word_val();
		terp.stack.push(term1 >= term2);
	},
	">":(terp)=> {
		var term1 = terp.stack.pop();
		var term2 = terp.get_next_word_val();
		terp.stack.push(term1 > term2);
	},
	"AND": function (terp) {
		var term1 = terp.stack.pop();
		var term2 = terp.get_next_word_val();
		terp.stack.push(term1 && term2);
	},
	
	"OR": function (terp) {
		var term1 = terp.stack.pop();
		var term2 = terp.get_next_word_val();
		terp.stack.push(term1 || term2);
	},
	
	"NOT": function (terp) {
		terp.stack.push(!terp.get_next_word_val());
	}
}

var arrayWords = 
{
	"[":(terp)=>
	{
		var val = terp.l.next_chars_up_to("]");
		val = val.split(",")
		terp.stack.push(val);
	},
	"rlen":(terp)=>
	{
		var arr = terp.stack.pop();
		terp.stack.push(arr.length);	
	},
	"ritem":(terp)=>
	{
		var arr = terp.stack.pop();
		var key = terp.get_next_word_val();
		terp.stack.push(arr[key]);
	},
	"rset":(terp)=>
	{
		var arr = terp.stack.pop();
		var key = terp.get_next_word_val();
		var val = terp.get_next_word_val();
		arr[key] = val
	},
	"rpush":(terp)=>
	{
		var arr = terp.stack.pop();
		var val = terp.get_next_word_val();
		arr.push(val)
	},
	
};



var consoleWords = 
{
	"cprint":(terp)=>
	{
		var line = terp.get_next_word_val();
		terp.cmd.writeLine(line);
	},
	"cinput":async (terp)=>
	{
		terp.stop = true;
		let val= await cmd.readLine();
		if(!isNaN(val)){val = parseFloat(val);}
		terp.stack.push(val);
		terp.stop = false;
		var code = terp.l.get_from_position();
		//console.log(code)
		terp.run(code);
		
		//console.log(val)
	},	
	"cinputn":async (terp)=>
	{
		terp.stop = true;
		let val= await cmd.readLine();
		if(!isNaN(val)){val = parseFloat(val);}
		if(isNaN(val)){val=0;}//incase of no number
		terp.stack.push(val);
		terp.stop = false;
		var code = terp.l.get_from_position();
		//console.log(code)
		terp.run(code);
		
		//console.log(val)
	},
}




Array.prototype.next = function() {
    return this[this.current++];
};
Array.prototype.prev = function() {
    return this[--this.current];
};
Array.prototype.current = 0;