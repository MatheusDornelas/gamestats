const request = require('request');
const util = require('util');
const DataDragonHelper = require('leaguejs/lib/DataDragon/DataDragonHelper');
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

		res.json({
			summonerName: response.name,
			summonerLevel: response.summonerLevel,
			summonerIconId: response.profileIconId,
			summonerIcon: "/img/project-fiora-icon.jpg"
		});
	});
}
