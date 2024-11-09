const allstar = document.querySelectorAll('.rating .star')
allstar.forEach((item, idx)=>{
    item.addEventListener('click',function() {
      allstar.forEach(i=> {
            i.classList.replace('bxs-star','bx-star')
            i.classList.remove('active')
        })
        for(let i=0; i<allstar.length;i++){
            if(i <= idx){
                allstar[i].classList.replace('bx-star','bxs-star')
                allstar[i].classList.add('active')
            }
            
        }
    });
});