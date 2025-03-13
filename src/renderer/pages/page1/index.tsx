/* eslint-disable @renderertypescript-eslint/no-misused-promises */
import { useState } from 'react';
import FilterRow from '@renderer/components/filterRow';
import AddTodo from '@renderer/components/addTodo';
import TodoList from '@renderer/components/todoList';
import { intl } from '@renderer/utils/index';
import { useModel } from '@enforcer-squad/rex';
import userModel from '@renderer/store/user';
import style from './index.less';

const Index = () => {
  const [count, setCount] = useState(0);
  const { doLogout } = useModel(userModel);
  return (
    <div className={style.test}>
      <FilterRow />
      <AddTodo />
      <TodoList />
      <div>
        {count}
        <button onClick={() => setCount(c => c + 1)}>{intl('增加')}</button>
      </div>
      <div>
        <button onClick={() => doLogout()}>{intl('退出')}</button>
      </div>
    </div>
  );
};

export default Index;
