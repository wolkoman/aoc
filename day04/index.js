require('../fetch.js')(4).then(x => {

  x = x.split("\n")[0].split('-').map( x => parseInt(x));
  let min = x[0];
  let max = x[1];

  function calculate(ex2){

    let count = 0;

    for(let i = min; i <= max; i++){
      let s = i.toString();
      let pre = 0, could = true, adj = null;
      for(let x = 0; x < s.length; x++){
        o = parseInt(s[x]);
        if(o < pre){
          could = false;
          break;
        }else if(pre === o){
            if(x+1 < s.length && parseInt(s[x+1]) === o && ex2){
              while(parseInt(s[x]) === o){
                x++;
                if(parseInt(s[x]) < o){
                  could = false;
                }
              }
              x--;
              pre = null;

            }else{
              adj = o;
            }
        }
        pre = o;
      }
      if(could && adj !== null){
        count++;
      }
    }

    console.log(count);
  }
  calculate(false);
  calculate(true);

});