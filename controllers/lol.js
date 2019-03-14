const request = require('request-promise');
const util = require('util');
const DataDragonHelper = require('leaguejs/lib/DataDragon/DataDragonHelper');
var accountId = '';
var region = '';
/*
Exemplo de assertion

  req.assert('email', 'Email is not valid').isEmail();
  req.assert('password', 'Password cannot be blank').notEmpty();
  req.sanitize('email').normalizeEmail({ gmail_remove_dots: false });
  req.sanitize('email').normalizeEmail({ gmail_remove_dots: false });
*/

/*
O que é isso?

const errors = req.validationErrors();
*/
exports.getIndex = (req, res) => {

	return DataDragonHelper.downloadingStaticDataByLocale('en_US', ['9.3.1'], 9).then(

		res.render('lolstats', {
			title: 'LoL Stats'
		})
	).catch(function(err){
		console.log(err);
	});

	//res.render('lolstats', {
	//	title: 'LoL Stats'
	//});
}

exports.getSummonerInfo = (req, res, next) => {
	let summonerId;

	let params = {
		region: 'br1',
		name: req.params.summonerName
	};

	request.get('https://' + params.region + '.api.riotgames.com/lol/summoner/v4/summoners/by-name/'+params.name+'?api_key='+process.env.LOL_KEY, {timeout: 60000}, (err, request, body) => {

		if(err){
			console.log('Deu erro', err);
			return err;
		}
		let response = JSON.parse(body);

		accountId = response.accountId;
		region = params.regi
		res.json({
			summonerName: response.name,
			summonerLevel: response.summonerLevel,
			summonerIconId: response.profileIconId,
			summonerIcon: "/img/project-fiora-icon.jpg"
		});
	});
}

/*
Params:
- region: [String]
- champion: [String]
- queue: [int]
- season: [int]
- amount: [int]
*/
exports.getLastMatches = (req, res, next) => {

	
	let url = 'https://br1.api.riotgames.com/lol/match/v4/matchlists/by-account/u_EI0yaA5UBWBwye6E_EX50n0sXoUglTq3FnrvCQgdk52oU';
	var qs = {};
	qs.api_key = process.env.LOL_KEY;
	if(req.query.champion){
		qs.champion = req.query.champion;
	}
	if(req.query.queue){
		qs.queue = req.query.queue;
	}
	if(req.query.season){
		qs.season = req.query.season;
	}
	if(req.query.amount){
		qs.endIndex = req.query.amount;
	}
	
	var options = {
		uri: url,
		qs: qs,
		json: true
	}

	request(options).then((matches) => {

		let a = matches.matches;
		let matchesList = [];

		matchesList = a.map((match) => {

			return request({
				uri: 'https://br1.api.riotgames.com/lol/match/v4/matches/' + match.gameId,
				qs: {
					api_key: process.env.LOL_KEY
				},
				json: true
			});
		});
		return Promise.all(matchesList);
	}).then((matches) => {

		res.json(matches);
	}).catch((err) => {
		console.log('ERROR!!!');
		next(err);
	})
}
