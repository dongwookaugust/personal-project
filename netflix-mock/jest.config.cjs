module.exports = {
  testEnvironment: "jest-environment-jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  transform: {
    "^.+\\.(ts|tsx|js|jsx)$": "babel-jest",
  },
  // moduleNameMapper를 아래와 같이 수정합니다.
  moduleNameMapper: {
    // CSS 파일 처리 규칙 (기존)
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
    // 이미지, 폰트 등 정적 파일 처리 규칙 (추가)
    "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$":
      "<rootDir>/__mocks__/fileMock.js",
  },
};
