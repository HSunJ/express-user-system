import prisma from "../config/prisma";
import userRepository from '../repositories/userRepository'

const createUser = async (user) => {
  /**
   * TODO
   * 1. 사용자가 입력한 이메일이 사용중인 이메일인지 확인 (이메일 중복 사용 여부)
   * - 만일 이메일이 사용 중이라면 회원가입 되지 않도록 함
   * 
   * 2. 이메일이 사용중이 아니라면, 입력받은 사용자를 데이터베이스에 저장
   * - 새로 가입된 사용자의 정보를 생성된 `id`와 함께 반환
   * - 이때, `password`와 같은 유저의 민감 정보는 반환되지 않아야 함
   * - `filterSensitiveUserData` 와 같은 메서드를 작성해서 노출되지 않도록 할 예정
   */

  const { email } = user;
  const existedUser = await userRepository.findByEmail(email);

  if (existedUser) {
    const error = new Error('유저가 이미 존재합니다');
    error.code = 422;
    error.data = { email };
    throw error;
  }
  const newUser = await userRepository.save(user);

  return filterSensitiveUserData(newUser);
};

const getUser = async ({email, password}) => {
   /** TODO
     * - 비즈니스 로직
     * 1. 사용자가 입력한 `email`로 데이터베이스의 User 데이터를 찾음
     * - 만일 User가 존재하지 않는다면 `401 Unauthorized` 상태 코드와 함께 빈 리스폰스 반환
     * 
     * 2. 데이터베이스에 저장된 `password`와 입력받은 `password` 비교
     * - 일치하지 않는다면 `401 Unauthorized` 상태 코드와 함께 빈 리스폰스 반환
     * - 일치한다면 우선 찾은 유저를 반환
     * - 회원가입 때와 마찬가지로, 민감한 정보는 반환되지 않아야 함
     */

  const user = await userRepository.findByEmail(email);
  if(!user){
    const error = new Error('존재하지 않는 유저입니다');
    error.code = 401;
    error.data = {};
    throw error
  }
  verifyPassword(password, user.password);

  return filterSensitiveUserData(user);
};

const verifyPassword = (inputPassword, userPassword) => {
  const isMatch = inputPassword === userPassword;
  if (!isMatch){
    const error = new Error('비밀번호가 틀렸습니다');
    error.code = 401;
    error.data = {};
    throw error
  }
}

const filterSensitiveUserData = (user) => {
    const { password: newUserPassword, ...inSensitiveData } = user
    return inSensitiveData

    // delete user.password
    // return user
  }

export default {
  createUser,
  getUser,
};
