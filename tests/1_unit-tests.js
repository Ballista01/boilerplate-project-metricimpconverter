const chai = require('chai');
let assert = chai.assert;
const ConvertHandler = require('../controllers/convertHandler.js');
const server = require('../server.js');
const evaluate = require('mathjs').evaluate;

let convertHandler = new ConvertHandler();

const errorMessage = 'invalid unit';

suite('Unit Tests', function(){
	test('Whole number input test', function (done) {
		const testNum = 1;
		chai
			.request(server)
			.get(`/api/convert?input=${testNum}km`)
			.end(function (err, res) {
				assert.equal(res.status, 200);
				assert.equal(res.body.initNum, testNum); 
				done();
			});
	});
	test('Decimal number input test', function (done) {
		const testDec = 1.2;
		chai
			.request(server)
			.get(`/api/convert?input=${testDec}km`)
			.end(function (err, res) {
				assert.equal(res.status, 200);
				assert.equal(res.body.initNum, testDec);
				done();
			});
	});
	test('Fraction number input test', function (done) {
		const testFraction = '1/2';
		chai
			.request(server)
			.get(`/api/convert?input=${testFraction}km`)
			.end(function (err, res) {
				assert.equal(res.status, 200);
				assert.equal(res.body.initNum, evaluate(testFraction));
				done();
			});
	});
	test('Fraction number input with decimal test', function (done) {
		const testDecFraction = '1.5/3';
		chai
			.request(server)
			.get(`/api/convert?input=${testDecFraction}km`)
			.end(function (err, res) {
				assert.equal(res.status, 200);
				assert.equal(res.body.initNum, evaluate(testDecFraction));
				done();
			});
	});
	test('Double fraction number input rejection test', function (done) {
		const testDoubleFraction = '3/2/3';
		chai
			.request(server)
			.get(`/api/convert?input=${testDoubleFraction}km`)
			.end(function (req, res) {
				assert.equal(res.status, 200);
				assert.equal(res.text, errorMessage);
				done();
			});
	});
	test('Test with no number input', function (done) {
		const testNoNumInput = 'km';
		chai
			.request(server)
			.get(`/api/convert?input=${testNoNumInput}`)
			.end(function (err, res) {
				assert.equal(res.status, 200);
				assert.equal(res.body.initNum, 1);
				done();
			});
	});

	const testNum = ['2', '1/2','1.2/3','3/.2','.5','.5/.1'];
	const testUnit = ['mi', 'km', 'gal', 'L', 'lbs', 'kg'];
	for(let i=0; i < testUnit.length; i++){
		test(`${testUnit[i]} value input test`, function (done) {
			chai
				.request(server)
				.get(`/api/convert?input=${testNum[i].concat(testUnit[i])}`)
				.end(function (err, res) {
					assert.equal(res.status, 200);
					assert.equal(res.body.initNum, evaluate(testNum[i]));
					assert.equal(res.body.initUnit, testUnit[i]);
					done();
				});
		});
	};

	test('Invalid unit input test', function (done) {
		const invalidUnitInput = '1ohm';
		chai
			.request(server)
			.get(`/api/convert?input=${invalidUnitInput}`)
			.end(function (err, res) {
				assert.equal(res.status, 200);
				assert.equal(res.text, errorMessage);
				done();
			});
	});
	
	for(let i=0; i < testUnit.length; i++){
		test(`${testUnit[i]} unit input test`, function (done) {
			chai
				.request(server)
				.get(`/api/convert?input=${testNum[i].concat(testUnit[i])}`)
				.end(function (err, res) {
					assert.equal(res.status, 200);
					assert.equal(res.body.initUnit, testUnit[i]);
					done();
				});
		});
	};
});