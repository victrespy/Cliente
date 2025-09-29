function ejercicio(){
    let vector1 = ["Ray", "Jose", "Dani"];
    let vector2 = ["Dani", "Jose", "Ivan"];

    for(let i=0; i<vector1.length; i++){
        let check = false;
        for(let k=0; k<vector1.length; k++){
            if(i !== k && vector1[i] === vector1[k]){
                check = true;
                break;
            }
        }
        for(let j=0; j<vector2.length && !check; j++){
            if(vector1[i] === vector2[j]){
                check = true;
                break;
            }
        }
        if(!check){
            console.log(vector1[i]);
        }
    }
    for(let i=0; i<vector2.length; i++){
        let check = false;
        for(let k=0; k<vector2.length; k++){
            if(i !== k && vector2[i] === vector2[k]){
                check = true;
                break;
            }
        }
        for(let j=0; j<vector1.length && !check; j++){
            if(vector2[i] === vector1[j]){
                check = true;
                break;
            }
        }
        if(!check){
            console.log(vector2[i]);
        }
    }
}