     //components
      //console component
      class Console{
          comps=[];
          input_received=false;
          blocking_interval=null;
          text_color="whitesmoke";
          constructor(root){
              this.elem=document.createElement("div");
              this.elem.className="console";
              this.elem.addEventListener('click',()=>{
                  if(this.lastComp.elem.className=="input"){
                      this.lastComp.elem.focus();
                  }
              });
              root.appendChild(this.elem);
              this.setTextColor("yellow");
             // this.writeLine("Hello");
              this.resetTextColor();
          }
          appendComponent(comp){
              this.comps.push(comp);
              this.elem.appendChild(comp.elem);
          }
          writeLine(txt){
              let text=new Text(txt,this.text_color);
              this.appendComponent(text);
          }
          async readLine(){
              let input=new Input(this.text_color);
              this.appendComponent(input);
              input.elem.focus();
              return new Promise(resolve=>{
                  this.blocking_interval=setInterval(()=>{
                      if(this.input_received){
                          this.input_received=false;
                          clearInterval(this.blocking_interval);
                          resolve(input.elem.innerText);
                      }
                  },500);
              })
          }
          setTextColor(color){
              this.text_color=color;
          }
          resetTextColor(){
              this.text_color="whitesmoke";
          }
          //helpers
          get lastComp(){return this.comps[this.comps.length-1]};
      }
      //text component
      class Text{
          constructor(txt,color){
              this.elem=document.createElement("p");
              this.elem.className="text";
              this.elem.style.color=color;
              this.elem.innerText=txt;
          }
      }
      //input component
      class Input{
          constructor(color){
              this.elem=document.createElement("p");
              this.elem.className="input";
              this.elem.style.color=color;
              this.elem.contentEditable=true;
              this.elem.addEventListener('keydown',function(e){
                  let key=e.key;
                  if(key=="Enter"){
                      e.preventDefault();
                      cmd.input_received=true;
                      cmd.lastComp.elem.contentEditable=false;
                      cmd.lastComp.elem.style.borderWidth="0px";
                  }
              });
          }
      }
	  
	  
/*
      let root=document.getElementById("root");

      let cmd=new Console(root);
      async function execute(){
          cmd.writeLine("Enter birth year");
          let birthYear= await cmd.readLine();
          let age=new Date().getFullYear()-parseInt(birthYear);
          cmd.setTextColor("magenta");
          cmd.writeLine("You are "+age+" years old");
      }
      execute();
*/