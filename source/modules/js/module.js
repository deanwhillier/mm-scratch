function TestModule() {
    console.log('Module test');
    return 'blah';
}

export class TestClass {
    classMethod = () => {
        return 'TestClass.classMathod';
    };
}

export default TestModule;
