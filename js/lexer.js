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
		
		while(t.isWhiteSpace(t.words.charAt(t.position)))
		{
			t.position++;
			if(t.isBiggerThenWordsLen(t.position)){return null;}
		
		}
		
		var endWord = t.position;
		
		while(!t.isWhiteSpace(t.words.charAt(endWord)))
		{
			endWord++;
			if(t.isBiggerThenWordsLen(endWord)){break;}
		}
		
		var collector = t.words.substring(t.position,endWord)
		endWord++;
		t.position = endWord
		t.last_word = collector;
		return collector;
	}//end next_word
	
	is_next_char(c)
	{
		var t = this;
		
		var check_pos = t.position;
		while(t.isWhiteSpace(t.words.charAt(check_pos)))
		{
			check_pos++;
		}
		return t.words.charAt(check_pos) == c;
	}

	append_after_next(str)
	{
		var t = this;
		t.words = t.words.substr(0,t.position)+" "+str+" "+t.words.substr(t.position);
	}
	
	get_from_position(){return this.words.substr( this.position);}
	
	next_chars_up_to(c)
	{
		var t = this;
		
		if(t.isBiggerThenWordsLen(t.position)){return null;}
		
		var newPos = t.position;
		
		while(t.words.charAt(newPos)!=c)
		{
			newPos++;
			if(t.isBiggerThenWordsLen(newPos)){return null;}
		
		}
		
		var collector = t.words.substring(t.position,newPos)
		newPos++;
		t.position = newPos

		return collector
		
		
	}
	
	next_chars_up_to_word(str)
	{
		var collector ="";
		var next_word ="";
		while (next_word.substr(-str.length, str.length) != str) 
		{
			var next_word = this.next_word();
			collector += " "+next_word+" ";
		} 
		
		return collector
	}
}//end lexer