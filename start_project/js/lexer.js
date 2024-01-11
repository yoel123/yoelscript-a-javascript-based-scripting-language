class lexer
{
	constructor(code) 
	{
		this.words = code;
		this.position = 0; 
		this.last_word = "";
	}//end constructor    
	
	isWhiteSpace(c){return  c ===" " ||  c ==="\t" ||  c ==="\n" ||  c ==="\r" || c ==="\v"; }
	
	isBiggerThenWordsLen(pos){ return pos >= this.words.length}
	
	next_word()
	{
		var t = this;
		
		if(t.isBiggerThenWordsLen(t.position)){return null;}
	}//end next_word
	
	
}//end lexer