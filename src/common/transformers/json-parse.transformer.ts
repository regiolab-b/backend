export const jsonParseTransformer = (value: any): any => {
  try {
    return JSON.parse(value)
  } catch (error) {
    return value
  }
}
