export interface ITestDataGenerator<T, U> {
	mockData: U
	connectDb(): Promise<void>
	disconnectDb(): Promise<void>
	create(data: any): Promise<void>
	clear(): Promise<void>
	getData(): Promise<T>
	getMockData(): U
	getId(): Promise<string>
}
