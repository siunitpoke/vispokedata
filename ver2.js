function watchparty() {
    name = "" + prompt("input pokemon name" , "")
    var party = ""
    for (let i = 0;i<data.length;++i){
        for(let j =0;j<6;++j){
            if (data[i].po[j].n == name){
                
                for (let k = 0; k < 6;++k){
                    party += data[i].po[k].n +" "
                }
                party += "\n"

            }

        }
    }
    console.log(party)
  }

  function item_list() {
    item = []
    itemname = ""
    for (let i = 0;i<data.length;++i){
        for(let j =0;j<6;++j){
            if (item.length == 0){
                item.push({value:1,name:data[i].po[j].i})
                itemname += data[i].po[j].i +" "
                continue
            }
            const targetitem = item.findIndex((v) => v.name === data[i].po[j].i);
            if (targetitem == -1){
                item.push({value:1,name:data[i].po[j].i})
                itemname += data[i].po[j].i +" "
            }
            else{
                item[targetitem].value += 1
            }
        }
    }
    //alert(itemname)
    console.log(item);
    return item
  }
  function t_list() {
    t = []
    for (let i = 0;i<data.length;++i){
        for(let j =0;j<6;++j){
            if (t.length == 0){
                t.push({value:1,name:data[i].po[j].t})
                continue
            }
            const targetitem = t.findIndex((v) => v.name === data[i].po[j].t);
            if (targetitem == -1){
                t.push({value:1,name:data[i].po[j].t})
            }
            else{
                t[targetitem].value += 1
            }
        }
    }
    return t
  }

  function makegraph(s,r,name,terasu,item){
    node = []
    edge = []
    nodeforgraph = []
    console.log("item",item,"terasu",terasu)

    id_count = 1
    for (let i = 0;i<data.length;++i){
        if (data[i].s != s && s != "" ){
            continue
        }
        if (data[i].r > r && r != "" ){
            continue
        }
        for(let j =0;j<6;++j){
            if (data[i].po[j].i ==""){
                break //道具不明のデータ削除
            }
            if (name != ""){
                if (name != data[i].po[j].n){
                    continue
                }
            }
            if (item != ""){
                if (item != data[i].po[j].i){
                    continue
                }
            }
            if (terasu != ""){
                if (terasu != data[i].po[j].t){
                    continue
                }
            }//そのポケモンが検索条件に一致しているか
            if (node.length == 0){
                for (let k= 0;k < 6;++k){
                    node.push({id:id_count,value:1,name:data[i].po[k].n,t:[{type:data[i].po[k].t,value:1}],i:[{item:data[i].po[k].i,value:1}]})
                    nodeforgraph.push({id:id_count,value:1,mass:1,label:data[i].po[k].n})
                    id_count++
                }
                for (let k = 1; k< 7 ;++k){
                    for (let l = k+1 ; l < 7;++l){
                        edge.push({from:k,to:l,width:1})
                    }
                }
            }
            else{
                id_memory = [0,0,0,0,0,0]
                for (let k=0;k<6;++k){
                    const targetitem = node.findIndex((v) => v.name === data[i].po[k].n);
                    if (targetitem == -1){
                        node.push({id:id_count,value:1,name:data[i].po[k].n,t:[{type:data[i].po[k].t,value:1}],i:[{item:data[i].po[k].i,value:1}]})
                        nodeforgraph.push({id:id_count,value:1,mass:1,label:data[i].po[k].n})
                        id_memory[k] = id_count
                        id_count++
                    }//上はポケモンが登録されていなかった時
                    else{
                        node[targetitem].value += 1
                        nodeforgraph[targetitem].value += 1
                        nodeforgraph[targetitem].mass += 1
                        id_memory[k] = node[targetitem].id
                        const targetterasu = node[targetitem].t.findIndex((v) => v.type === data[i].po[k].t);
                        if (targetterasu == -1){
                            node[targetitem].t.push({type:data[i].po[k].t,value:1})
                        }
                        else{
                            node[targetitem].t[targetterasu].value += 1
                        }
                        const targetdougu = node[targetitem].i.findIndex((v) => v.item === data[i].po[k].i);
                        if (targetdougu == -1){
                            node[targetitem].i.push({item:data[i].po[k].i,value:1})
                        }
                        else{
                            node[targetitem].i[targetdougu].value += 1
                        }
                    }
                }
                for (let k = 0;k < 6;k++){
                    for (let l = k+1;l<6;l++){
                        a = Math.min(id_memory[k],id_memory[l])
                        b = Math.max(id_memory[k],id_memory[l])
                        const targetedge= edge.findIndex((v) => v.from === a && v.to === b);
                        if (targetedge == -1){
                            edge.push({from:a,to:b,width:1})
                        }
                        else{
                            edge[targetedge].width+=1
                        }
                    }
                }
              

            }
            break //一回そのパーティを追加したら次へ
        }
    }
    console.log("node",node)
    return [node,edge,nodeforgraph]
  }

//   function graphcreate(){
//     var network = new vis.Network(container, datas, options);
//   }
var input_data = {s:"",r:10,name:"",terasu:"",item:""}
  function makenodeedge(){

    s = input_data.s
    r = input_data.r
    name1 = input_data.name
    terasu = input_data.terasu
    item =input_data.item
    console.log("data",data)
    console.log("abc",s,r,name1,terasu,item,input_data.s)

    console.log("Inputdata",input_data)

    k=makegraph(s,r,name1,terasu,item)
console.log(k)

var nodes = new vis.DataSet(k[2]);
var edges = new vis.DataSet(k[1]);
var datas = {
    nodes: nodes,
    edges: edges
  };
  var network = new vis.Network(container, datas, options);
  //クリック時のイベント
network.on("click", function(params) {
    if (params.nodes.length == 1) {
      var nodeId = params.nodes[0];
      var node = nodes.get(nodeId);
      console.log(node.label + 'がクリックされました');
    }
  });


  }


var pokemonnamejp = new Array(
    "",  //ダミーの項目を一つ追加します
    "",
    "入力"
    );
  function inputpokemonnamef(){
    var num;
    num = document.navi1.contents1.selectedIndex;
    if ( num != 0 ) input_data.name = pokemonnamejp[num];
    if ( num == 2 ) input_data.name = "" + prompt("input pokemon name" , "")
    //console.log("name",input_data.name)

  }
 var pokemonterasutypejp = new Array(
    "",
     "",
     "入力"
 );

   function inputterasutype(){
     var num;
     num = document.navi2.contents2.selectedIndex;
     if ( num != 0 ) input_data.terasu = pokemonterasutypejp[num];
     if ( num == 2 ) input_data.terasu = "" + prompt("input terasu type" , "")

   }
var pokemonitemjp = new Array(
    "",
     "",
     "入力"
 );
function inputitem(){
    var num;
    num = document.navi3.contents3.selectedIndex;
    if ( num != 0 ) input_data.item = pokemonitemjp[num];
    if ( num == 2 ) input_data.item = "" + prompt("input terasu type" , "")
}
   var inputrank1 = new Array(
    "",
    10,
     100,
     100000000,
     ""
 );

   function inputrank(){
     var num;
     num = document.rankf.rankn.selectedIndex;
     if ( num != 0 ) input_data.r = inputrank1[num];
     if ( num == 4 ) input_data.r = Number(prompt("input rank" , ""))

   }
   var inputseason1 = new Array(
    "",
    "",
    ""
 );

   function inputseason(){
     var num;
     num = document.seasonf.seasonn.selectedIndex;
     if ( num != 0 ) input_data.s = inputseason1[num];
     if ( num == 2 ) input_data.s = Number(prompt("input season" , ""))

   }

   function option_pokemon(){
    const inputpokemonname_select = document.getElementById('inputpokemonname');
for (let i =0;i<k[0].length;++i){
//option要素を新しく作る
var option1 = document.createElement('option');

//option要素にvalueと表示名を設定
option1.textContent = k[0][i].name;
pokemonnamejp.push(k[0][i].name)
//select要素にoption要素を追加する
inputpokemonname_select.appendChild(option1)
}
var option1 = document.createElement('option');
option1.textContent = "選択なし";
pokemonnamejp.push("")
//select要素にoption要素を追加する
inputpokemonname_select.appendChild(option1)
   }
   function option_season(){
    const season_select = document.getElementById('seasonid');
maxi = data[0].s
for (let i =1;i<maxi+2;++i){
var option1 = document.createElement('option');
option1.textContent = String(i);
inputseason1.push(String(i))
season_select.appendChild(option1)
}
var option1 = document.createElement('option');
option1.textContent = "選択なし";
inputseason1.push("")
season_select.appendChild(option1)
   }
   function option_terasu(){
    const terasu_select = document.getElementById('terasuselect');
    t = t_list()
    t.sort((a, b) => b.value - a.value);
    for (let i =0;i<t.length;++i){
        if (t[i].name == ""){
            continue
        }
        var option1 = document.createElement('option');
        option1.textContent = t[i].name;
        pokemonterasutypejp.push(t[i].name)
        terasu_select.appendChild(option1)
        }
        var option1 = document.createElement('option');
        option1.textContent = "選択なし";
        pokemonterasutypejp.push("")
        terasu_select.appendChild(option1)
    }
    function option_item(){
        const item_select = document.getElementById('itemselect');
        t = item_list()
        t.sort((a, b) => b.value - a.value);
        for (let i =0;i<t.length;++i){
            if (t[i].name == ""){
                continue
            }
            var option1 = document.createElement('option');
            option1.textContent = t[i].name;
            pokemonitemjp.push(t[i].name)
            item_select.appendChild(option1)
            }
            var option1 = document.createElement('option');
            option1.textContent = "選択なし";
            pokemonitemjp.push("")
            item_select.appendChild(option1)
        }


   function func1() {
    document.location.reload();
  }


//   function setdata(){
//     k=makegraph()
// console.log(k)

// var nodes = new vis.DataSet(k[2]);
// var edges = new vis.DataSet(k[1]);
// console.log(nodes,edges)
// network.setData(nodes,edges)
//   }



  