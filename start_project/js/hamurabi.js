
var hamurabi =  `

// all the variables this game will need

var year
var starved // people that starved this turn
var immigrants // people that came to your city this turn
var population // how many people you currently have
var harvest // total bushels harvested'
var planted_land // how many land was used for planting this turn
var bushels_per_acre // amount harvested for each acre planted
var rats_ate // how many bushels destroyed by rats this turn
var bushels_in_storage // the total amount of grain bushels you own
var acres_owned // the land you own
var cost_per_acre // each acre costs this many bushels
var plague_deaths // how many people died of plague this turn
var Total_starved // the total people that starved durring this game (in all turns)
var land_bought // land bought this turn

// initial game vars value

1 ! year
0 ! starved
5 ! immigrants
100 ! population
3000 ! harvest
0 ! planted_land
3 ! bushels_per_acre
200 ! rats_ate
2800 ! bushels_in_storage	
1000 ! acres_owned
19 ! cost_per_acre
0 ! plague_deaths
0 ! Total_starved
0 ! land_bought

// turn summery////////////
def summery
	var str
	cprint ' O great Hammurabi!  i beg to report to you,'

	' in year ' + @ year + ' , ' + @ starved + '  people starved, ' + @ immigrants +  
	' people came to the city ' ! str
	cprint @ str

	' the population now is ' + @ population ! str
	cprint @ str

	' we harvested ' + @ harvest + '  bushels at ' + @ bushels_per_acre + '  bushels per acre.' ! str
	cprint @ str

	' Rats destroyed '+ @ rats_ate + '  bushels,' ! str 
	cprint @ str
	' leaving '+ @ bushels_in_storage + '  bushels in storage.' ! str
	cprint @ str

	' The city owns ' + @ acres_owned + '  acres of land. ' ! str
	cprint @ str

	' Land is currently worth ' + @ cost_per_acre + '  bushels per acre.' ! str

	cprint @ str

	/* if there were any plague deaths */

	if ( @ plague_deaths > 0 )  
	{ 

		' There were ' +  @ plague_deaths + '  deaths from the plague' ! str
		cprint @ str
	}


end

// end turn summery////////////

def ask_to_buy_land
	var acers
	var acers_cost
	var str
	cprint ' ----------------------'
	cprint ' how many acres will you buy? '
	cinputn ! acers
	/* calculate the cost*/
	@ acers * @ cost_per_acre ! acers_cost
	/* check if can buy*/
	if ( @ acers_cost > @ bushels_in_storage) 
	{
		cprint ' O great Hammurabi we do not have enogh bushels [try a lower number or 0 to skip] '
		ask_to_buy_land
	}
	else
	{
		/* reduce bushels from storage*/
		@ bushels_in_storage - @ acers_cost ! bushels_in_storage
		/* add acers*/
		@ acres_owned + @ acers ! acres_owned
		/* show user the result*/
		' you bought ' + @ acers + ' acers now you own ' + @ acres_owned + ' acers' ! str
		cprint @ str
		' leaving '+ @ bushels_in_storage + '  bushels in storage.' ! str
		cprint @ str
		@ acers ! land_bought
		
	}
end
// end ask_to_buy_land////////////

def ask_to_sell_land
	var acers
	var bushels_add
	var str
	/* get how much user want to sell*/
	cprint ' ----------------------'
	cprint ' how many acres will you sell? '
	cinputn ! acers
	/* if he wants to sell more then he has limit it to the max he owns*/
	if ( @ acers > @ acres_owned) { @ acres_owned ! acers }
	/* how much bushels gaind from selling acers*/
	@ acers * @ cost_per_acre ! bushels_add
	/* reduce acers player owns*/
	@ acres_owned - @ acers ! acres_owned
	/* add bushels add from deal*/
	@ bushels_in_storage + @ bushels_add ! bushels_in_storage
	/* display to player how mush bushels and acers he owns*/
	' you sold ' + @ acers + ' acers now you own ' + @ acres_owned + ' acers' ! str
	cprint @ str
	' leaving '+ @ bushels_in_storage + '  bushels in storage.' ! str
	cprint @ str
end
// end ask_to_sell_land////////////

def ask_to_feed
	var bushels
	var people_fed
	/* ask the user how many bushels to give to the people*/
	cprint ' ----------------------'
	cprint ' how many bushels will you use for feeding your people? '
	cinputn ! bushels
	/* make sure user input is not bigger then total bushels in storage*/
	if ( @ bushels > @ bushels_in_storage ) { @ bushels_in_storage ! bushels }
	/* reduce from total bushels in storage*/
	@ bushels_in_storage - @ bushels ! bushels_in_storage
	/* check how many people starved*/
	/* population-(feeding/20)*/
	@ bushels / 20 yint ! people_fed
	@ population - @ people_fed ! starved
	@ Total_starved + @ starved ! Total_starved
	if ( @ starved < 0 ) { 0 ! starved} /* cant starve negtive number of people*/
	' leaving '+ @ bushels_in_storage + '  bushels in storage.' ! str
	cprint @ str
end 
// end ask_to_feed////////////


def ask_to_cultivate
	var land_to_seed
	var population_work_power
	var str
	cprint ' ----------------------'
	' how much land do you want to plant seed in? (you have ' + @ acres_owned + ' land avilable)' ! str 
	cprint @ str
	cinputn ! land_to_seed
	/* check if inputed a number bigger then land owned*/
	if ( @ land_to_seed > @ acres_owned) { @ acres_owned ! land_to_seed }
	/* check i have menpower to work the land*/
	@ population * 10 ! population_work_power
	if ( @ land_to_seed > @ population_work_power) { @ population_work_power ! land_to_seed}
	/* check if has bushels to seed all the land (1 bushel per land)*/
	if ( @ land_to_seed > @ bushels_in_storage) { @ bushels_in_storage ! land_to_seed}
	@ land_to_seed ! planted_land
	' as you command, we will plant ' + @ planted_land + ' acers' ! str
	cprint @ str
	cprint ' ----------------------'
end 
// end ask_to_cultivate////////////

def lose_onditions

end 
// end lose_onditions////////////

def do_rats
	var chance_rats
	var percent_destroyed
	0 ! rats_ate
	rand 1 100 ! chance_rats

	if ( @ chance_rats < 40 ) 
	{ 
		rand 1 3 ! percent_destroyed
		@ percent_destroyed / 10 ! percent_destroyed
		@ percent_destroyed * @ bushels_in_storage yint ! rats_ate
		@ bushels_in_storage - @ rats_ate ! bushels_in_storage
	}

end 
// end do_rats////////////

def do_plague 
	var chance

   rand 1 100 ! chance

   if ( @ chance < 45 ) 
   {
	   @ population / 2 yint ! plague_deaths
	   @ population / 2 yint ! population
   } 
   else 
   {
		0 ! plague_deaths   
   }
end 
// end do_plague////////////

def do_immigrants
	var add_rand
	var did_starve
	@ starved > 0 ! did_starve
	
	if ( @ plague_deaths > 0 or @ did_starve)
	{
		0 ! immigrants
	} else 
	{
		rand 1 50 ! immigrants
		even_more_immigrants

	}
	
	@ population + @ immigrants ! population
end
// end do_immigrants////////////

def even_more_immigrants
	var add_rand
	if ( @ bushels_in_storage > 7000) 
	{
		rand 1 100 ! add_rand
		@ immigrants + @ add_rand ! immigrants
	}
end
// end even_more_immigrants////////////

def pass_turn

	/* pass year*/
	@ year + 1 ! year
	/* starve population (if the player starver any)*/
	@ population - @ starved ! population 
	/* corps yield on planted land*/
	rand 1 8 ! bushels_per_acre
	@ planted_land * @ bushels_per_acre ! harvest
	@ bushels_in_storage + @ harvest ! bushels_in_storage /* add harvest to storage*/
	/* check if rats ate any corps*/
	do_rats
	/* check if plague killd anyone*/
	do_plague
	/* check if people immagrated to the city*/
	do_immigrants
	/* randomize land price*/
	rand 18 23 ! cost_per_acre
	var num
	cprint ' ----------------------'
	cprint ' press enter to finish turn... '
	cinputn ! num
end 
// end pass_turn////////////

def end_game
	var str
	var did_starve_too_many
	var did_starve_less_then_limit
	@ Total_starved > 20 ! did_starve_too_many
	@ Total_starved < 20 ! did_starve_less_then_limit
	cprint ' ----------------------'
	cprint ' --------game over: --------------'
	cprint ' ----------------------'
	/* bad ending*/
	if ( @ did_starve_too_many) 
	{
		' you starved more then ' + @ starved + '  people' ! str
		cprint @ str
		cprint ' YOUR HEAVY-HANDED PERFORMANCE SMACKS OF NERO AND IVAN IV.'
		cprint ' THE PEOPLE (REMIANING) FIND YOU AN UNPLEASANT RULER, AND,'
		cprint ' FRANKLY, HATE YOUR GUTS!!'
	}
	var acers_gained /* how much acers you have gained during the game*/
	@ acres_owned - 1000 ! acers_gained
	@ starved < 20 log
	/* good ending*/
	if ( @ acers_gained > 100 and @  did_starve_less_then_limit )
	{
		cprint ' A FANTASTIC PERFORMANCE!!!  CHARLEMANGE, DISRAELI,AND'
		cprint ' JEFFERSON COMBINED COULD NOT HAVE DONE BETTER!'
	}
	/* meh ending*/
	var people_want_to_asassinate
	rand 2 8 ! people_want_to_asassinate
	if ( @ acers_gained <= 0  and @ did_starve_less_then_limit )
	{
		cprint ' YOUR PERFORMANCE COULD HAVE BEEN SOMEWHAT BETTER, BUT'
		' REALLY WAS NOT TOO BAD AT ALL. ' +  @ people_want_to_asassinate + '  PEOPLE' ! str
		cprint @ str
		cprint ' WOULD DEARLY LIKE TO SEE YOU ASSASSINATED BUT WE ALL HAVE OUR'
		cprint ' TRIVIAL PROBLEMS.'
	}
	

end
// end end_game////////////

def Hammurabi
	
	/* loop ( 11,i) */
		
	ask_to_buy_land 
	ask_to_sell_land
	ask_to_feed
	ask_to_cultivate
	pass_turn
	summery

	if ( @ year < 11) { Hammurabi}
end
// end Hammurabi////////////

summery
Hammurabi
end_game


 `;