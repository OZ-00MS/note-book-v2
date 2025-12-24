    // ===== NOTES APP =====
    const newNoteBtn = document.getElementById("newNoteBtn");
    const searchBtn = document.getElementById("searchBtn");
    const newNoteForm = document.getElementById("newNoteForm");
    const cancelBtn = document.getElementById("cancelBtn");
    const saveBtn = document.getElementById("saveBtn");
    const notesContainer = document.getElementById("notesContainer");
    const searchContainer = document.getElementById("searchContainer");
    const searchInput = document.getElementById("searchInput");
    const emptyState = document.getElementById("emptyState");
    const emptyStateNewNoteBtn = document.getElementById("emptyStateNewNoteBtn");

    let notes = JSON.parse(localStorage.getItem("notes")) || [];
    let editIndex = null;

    newNoteBtn.onclick = () => { newNoteForm.classList.remove("hidden"); };
    cancelBtn.onclick = () => { newNoteForm.classList.add("hidden"); clearForm(); };
    emptyStateNewNoteBtn.onclick = () => { newNoteForm.classList.remove("hidden"); emptyState.classList.add("hidden"); };
    searchBtn.onclick = () => { searchContainer.classList.toggle("hidden"); };

    function clearForm() { document.getElementById("noteTitle").value=""; document.getElementById("noteContent").value=""; editIndex=null; }

    saveBtn.onclick = () => {
      const title = document.getElementById("noteTitle").value.trim();
      const content = document.getElementById("noteContent").value.trim();
      if(!title) return alert("Note must have a title!");
      const note = {title, content};
      if(editIndex!==null){ notes[editIndex]=note; editIndex=null; } else { notes.push(note); }
      localStorage.setItem("notes", JSON.stringify(notes));
      clearForm(); newNoteForm.classList.add("hidden"); renderNotes();
    };

    function renderNotes(filter="") {
      notesContainer.innerHTML="";
      const filtered = notes.filter(n=>n.title.toLowerCase().includes(filter.toLowerCase()));
      filtered.length===0 ? emptyState.classList.remove("hidden") : emptyState.classList.add("hidden");
      filtered.forEach((note,idx)=>{
        const card=document.createElement("div");
        card.className="p-4 bg-white/90 rounded-xl shadow flex flex-col gap-2";
        card.innerHTML=`<div class="font-bold">${note.title}</div><div class="text-gray-700">${note.content}</div><div class="flex justify-end gap-2"><button class="edit text-blue-600 font-semibold">Edit</button><button class="delete text-red-600 font-semibold">Delete</button></div>`;
        card.querySelector(".edit").onclick=()=>{ document.getElementById("noteTitle").value=note.title; document.getElementById("noteContent").value=note.content; newNoteForm.classList.remove("hidden"); editIndex=notes.indexOf(note); };
        card.querySelector(".delete").onclick=()=>{ if(confirm("Delete this note?")){ notes.splice(notes.indexOf(note),1); localStorage.setItem("notes",JSON.stringify(notes)); renderNotes(searchInput.value); }};
        notesContainer.appendChild(card);
      });
    }

    searchInput.oninput = ()=>renderNotes(searchInput.value);
    renderNotes();

    // ===== CLOCK =====
    function updateClock(){
      const now = new Date();
      document.getElementById('clock').textContent = now.toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'});
      document.getElementById('date').textContent = now.toLocaleDateString();
    }
    updateClock(); setInterval(updateClock,1000);

    // ===== GAME (4x4) =====
    const symbols=['🍎','🍌','🍇','🍓','🍒','🥝','🍍','🥑'];
    const board=document.getElementById('game-board');
    let flipped=[],matches=0,lock=false;
    const scoreEl=document.getElementById('score');
    const levelEl=document.getElementById('level');

    function shuffle(array){return array.sort(()=>Math.random()-0.5);}
    function startGame(){
      board.innerHTML=''; flipped=[]; matches=0; lock=false; scoreEl.textContent=0;
      const cards=shuffle([...symbols,...symbols]);
      cards.forEach(s=>{
        const c=document.createElement('div');
        c.className='card-game aspect-square bg-white/20 rounded-md flex items-center justify-center cursor-pointer select-none transition-transform duration-200';
        c.dataset.s=s; c.textContent=''; c.addEventListener('click',()=>flipCard(c));
        board.appendChild(c);
      });
    }
    function flipCard(c){
      if(lock || c.classList.contains('flipped') || c.classList.contains('matched')) return;
      c.classList.add('flipped'); c.textContent=c.dataset.s; flipped.push(c);
      if(flipped.length===2){ lock=true; setTimeout(checkMatch,400); }
    }
    function checkMatch(){
      const [a,b]=flipped;
      if(a.dataset.s===b.dataset.s){ a.classList.add('matched'); b.classList.add('matched'); matches++; scoreEl.textContent=matches; }
      else { a.classList.remove('flipped'); b.classList.remove('flipped'); a.textContent=b.textContent=''; }
      flipped=[]; lock=false;
    }
    startGame();

    // ===== DRAW =====
    const canvas=document.getElementById('canvas'); 
    const ctx=canvas.getContext('2d');
    const colorInput=document.getElementById('color');
    const sizeInput=document.getElementById('size');
    const clearBtn=document.getElementById('clearDraw');

    function resizeCanvas(){ canvas.width=canvas.clientWidth; canvas.height=canvas.clientHeight; }
    window.addEventListener('resize',resizeCanvas); resizeCanvas();

    let drawing=false;
    canvas.onmousedown=e=>{drawing=true; ctx.beginPath(); ctx.moveTo(e.offsetX,e.offsetY);};
    canvas.onmousemove=e=>{ if(drawing){ ctx.strokeStyle=colorInput.value; ctx.lineWidth=sizeInput.value; ctx.lineCap='round'; ctx.lineTo(e.offsetX,e.offsetY); ctx.stroke(); ctx.beginPath(); ctx.moveTo(e.offsetX,e.offsetY); }};
    canvas.onmouseup=()=>drawing=false;
    canvas.onmouseleave=()=>drawing=false;
    clearBtn.onclick=()=>ctx.clearRect(0,0,canvas.width,canvas.height);