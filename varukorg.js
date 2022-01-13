var kundkorg = {
  hVarukorgProdukter : null, // Nuvarande produkter i varukorgen
  hProdukter : null, //Lista html produkter
  items : {}, 
  iURL : "images/", // Url bilder av produkter

  save : () => 
  {
    localStorage.setItem("kundkorg", JSON.stringify(kundkorg.items));
  },
  
  nuke : () => 
  {
      kundkorg.items = {};
      localStorage.removeItem("kundkorg");
      kundkorg.list();
  },

  load : () => 
  {
    kundkorg.items = localStorage.getItem("kundkorg");
    if (kundkorg.items == null) 
	{ 
		kundkorg.items = {}; 
	}
    else 
	{ 
		kundkorg.items = JSON.parse(kundkorg.items);
	}
  },

  init : () => 
  {
    kundkorg.hProdukter = document.getElementById("produkter"); 
    kundkorg.hVarukorgProdukter = document.getElementById("varukorgProdukter");

    kundkorg.hProdukter.innerHTML = "";
    let item, b, bit;
	
	// Loop för visa innehåll i produkt-arrayen (produktArr)
	// Skapar/visar img, namn, beskrivning, pris
    for (let id in produktArr) 
	{
      b = produktArr[id];
      item = document.createElement("div");
      item.className = "bItem";
      kundkorg.hProdukter.appendChild(item);

      bit = document.createElement("img");
      bit.src = kundkorg.iURL + b.img;
      bit.className = "bImg";
      item.appendChild(bit);

      bit = document.createElement("div");
      bit.innerHTML = b.namn;
      bit.className = "bNamn";
      item.appendChild(bit);

      bit = document.createElement("div");
      bit.innerHTML = b.pris + "kr";
      bit.className = "b-pris";
      item.appendChild(bit);

	// Knapp för att lägga till i kundkorg
	// Vid klick på knapp anropas add
      bit = document.createElement("input");
      bit.type = "button";
      bit.value = "Lägg till i kundkorg";
      bit.className = "kundkorg b-add";
      bit.onclick = () => 
	  { 
		kundkorg.add(id); 
	  };
      item.appendChild(bit);
    }

    kundkorg.load(); //Ladda kundkorg 
    kundkorg.list(); // Visa listan
  },

  //Visa lista
  list : () => 
  {
    kundkorg.hVarukorgProdukter.innerHTML = "";
    let bit, item;
    let empty = true;
    for (let key in kundkorg.items) 
	{
      if(kundkorg.items.hasOwnProperty(key))
		{
			 empty = false; 
			 break; 
		}
    }

    // Kolla om kundkorg/listan är tom
    if (empty) 
	{
      item = document.createElement("div");
      item.innerHTML = "Tom kundkorg";
      kundkorg.hVarukorgProdukter.appendChild(item);
    }

    else 
	{
      let b, total = 0, delsumma = 0;
      for (let id in kundkorg.items) 
	  {
        b = produktArr[id];
        item = document.createElement("div");
        item.className = "cItem";
        kundkorg.hVarukorgProdukter.appendChild(item);

        bit = document.createElement("div");
        bit.innerHTML = b.namn;
        bit.className = "cNamn";
        item.appendChild(bit);

        bit = document.createElement("input");
        bit.type = "button";
        bit.value = "X";
        bit.className = "cDel kundkorg";
        bit.onclick = () => 
		{ 
			kundkorg.remove(id); 
		};
        item.appendChild(bit);

        bit = document.createElement("input");
        bit.type = "number";
        bit.min = 0;
        bit.value = kundkorg.items[id];
        bit.className = "c-qty";
        bit.onchange = function () 
		{
			kundkorg.change(id, this.value); 
		};
        item.appendChild(bit);

        delsumma = kundkorg.items[id] * b.pris;
        total += delsumma;
      }
	  
	  //Visa pris
      item = document.createElement("div");
      item.className = "cTotal";
      item.id = "cTotal";
      item.innerHTML ="Pris: " + total +"kr";
      kundkorg.hVarukorgProdukter.appendChild(item);

      //btn för att tömma kundkorg
      item = document.createElement("input");
      item.type = "button";
      item.value = "Töm kundkorg";
      item.onclick = kundkorg.nuke;
      item.className = "cEmpty kundkorg";
      kundkorg.hVarukorgProdukter.appendChild(item);

	  //Btn till kassan
      item = document.createElement("input");
      item.type = "button";
      item.value = "Till kassan";
      item.onclick = kundkorg.checkout;
      item.className = "tillKassan kundkorg";
      kundkorg.hVarukorgProdukter.appendChild(item);
    }
  },

  add : (id) => 
  {
    if (kundkorg.items[id] == undefined) 
	{ 
		kundkorg.items[id] = 1; 
	}
    else 
	{ 
		kundkorg.items[id]++; 
	}
    kundkorg.save(); 
	kundkorg.list();
  },

  // Ta bort eller lägg till antal produkter  
  change : (pid, qty) => 
	{
    if (qty <= 0) 
	{
      delete kundkorg.items[pid];
      kundkorg.save(); 
	  kundkorg.list();
    }

    else 
	{
      kundkorg.items[pid] = qty;
      var total = 0;
      for (let id in kundkorg.items) 
	  {
        total += kundkorg.items[id] * produktArr[id].pris;
        document.getElementById("cTotal").innerHTML ="Pris: " + total + "kr";
      }
    }
  },

  // Ta bort en produkt från varukorgen
  remove : (id) => 
  {
    delete kundkorg.items[id];
    kundkorg.save();
    kundkorg.list();
  },


};
window.addEventListener("DOMContentLoaded", kundkorg.init);
