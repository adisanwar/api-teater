import { sayHello } from "../src/say-hello";
describe ('sayHello', function () {
    it('should return hello adi', function (){
        expect(sayHello('adi')).toBe('Hello adi');
    })
})