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

		
	}//end run
	
	compile(w)
	{

		
	}//end compile
	
	interpet(w)
	{

		
	}//end interpet

	

	
}//end interpreter


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






Array.prototype.next = function() {
    return this[this.current++];
};
Array.prototype.prev = function() {
    return this[--this.current];
};
Array.prototype.current = 0;