<template>
  <div>
    <div class="content">
      <div
        class="container"
        id="container"
        :class="{ 'penal-right-active': !isSignIn }"
      >
        <!-- 注册页面 -->
        <!-- <div class="form-container sign-up-container">
          <form>
            <h1>register</h1>
            
            <div class="social-container">
              <a href="#"><i class="fab fa-qq"></i></a>
              <a href="#"><i class="fab fa-weixin"></i></a>
              <a href="#"><i class="fab fa-weibo"></i></a>
            </div>
            <input
              type="text"
              name="userName"
              placeholder="userName..."
              required
              v-model.trim="registerInfo.userName"
            />
            <input
              type="email"
              name="email"
              placeholder="Email..."
              required
              v-model.trim="registerInfo.email"
            />
            <input
              type="password"
              name="password"
              placeholder="Password..."
              required
              v-model.trim="registerInfo.password"
            />
            <input
              type="text"
              name="permitCode"
              placeholder="permitCode"
              required
              v-model.trim="registerInfo.permitCode"
            />
            <button @click="register">register</button>
          </form>
        </div> -->

        <!-- 登录页面 -->
        <div class="form-container sign-in-container">
          <form>
            <h1>Schneider</h1>
            <!-- 公共组件 -->
            <div class="social-container">
              <!-- <a href="#"><i class="fab fa-qq"></i></a>
              <a href="#"><i class="fab fa-weixin"></i></a>
              <a href="#"><i class="fab fa-weibo"></i></a> -->
            </div>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Email..."
              v-model="info.email"
            />
            <input
              type="password"
              name="password"
              id="password"
              placeholder="Password..."
              v-model="info.password"
              autocomplete="off"
            />
            <a href="#" class="forget"></a>
            <button @click="signIn">sign in</button>
          </form>
        </div>

        <!-- 覆盖容器 -->
        <div class="overlay-container">
          <div class="overlay">
            <!-- 覆盖左边 -->
            <div class="overlay-penal overlay-left-container">
              <h1>welcome back!</h1>
              <p>
                To keep connected with us please login with your personal info
              </p>
              <button class="ghost" id="signIn" @click="signInToggle">
                sign in
              </button>
            </div>

            <!-- 覆盖右边 -->
            <div class="overlay-penal overlay-right-container">
              <h1>Hello Friend!</h1>
              <p>Welcome back to Schneider Electric Information Platform</p>
              <!-- <button class="ghost" id="signUp" @click="signUpToggle">
                register
              </button> -->
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getAccount } from "../../axios/api";
export default {
  data() {
    return {
      isSignIn: true,
      info: {
        password: "",
        email: "",
      },
      reqResult: {},
      account: [
        {
          userName: "admin01",
          password: "admin01",
          email: "2484100597@qq.com",
          type: "admin",
        },
        {
          userName: "admin02",
          password: "admin02",
          type: "menber",
          email: "yangtao_1999@qq.com",
        },
      ],
    };
  },
  mounted() {
    window.localStorage.setItem(
      "login",
      JSON.stringify({ isLogin: false, name: "" })
    );
  },
  methods: {
    // 状态切换
    signInToggle() {
      this.isSignIn = true;
    },
    signUpToggle() {
      this.isSignIn = false;
    },
    // 登录注册
    register(e) {
      let resEM = this.account.find((el) => {
        return el.email === this.registerInfo.email;
      });
      let reg =
        /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/;
      if (!reg.test(this.registerInfo.email)) {
        return;
      }
      if (
        this.registerInfo.userName === "" ||
        this.registerInfo.password === "" ||
        this.registerInfo.email === ""
      ) {
        // alert("有未填写的信息！")
        return;
      }
      if (this.registerInfo.permitCode != "123456") {
        alert("校验码错误！");
        e.preventDefault();
        return;
      }
      if (!resEM) {
        this.$bus.$emit("login", true);

        this.$router.push({
          name: "home",
          params: { isLogin: true },
        });
      } else {
        alert("该邮箱已注册");
        e.preventDefault();
      }
      this.account.unshift();
    },
    ckAccount() {},
    signIn(e) {
      getAccount({
        email: this.info.email,
        password: this.info.password,
      }).then((res) => {
        if (res) {
          this.$bus.$emit("login", true);
          window.localStorage.setItem(
            "login",
            JSON.stringify({
              isLogin: true,
              username: res.userName,
              email: res.email,
              type: res.type,
            })
          );
          this.$router.push({
            name: "home",
          });
        } else {
          this.$bus.$emit("login", false);
          alert("账号或密码错误！");
          e.preventDefault();
        }
      });

      let res = this.reqResult;

      e.preventDefault();
    },
  },
};
</script>

<style scoped>
* {
  box-sizing: border-box;
}
.content {
  position: relative;

  /* border: 1px red solid; */
}
.bgImg {
  border: 1px red solid;
  filter: blur(5px);
  position: absolute;
  /* left: -305px; */
  width: 100vw;
  height: 100vh;
  z-index: -1;
  background-image: url("./img/back2.jpeg");
  background-size: 1920px 100vh;
}

/* login */
* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}

.content {
  background-image: url("./img/back2.jpeg");
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  /* 6699ff  F6F5F7*/
  background-color: #6699ff;
}
button {
  outline: none;
  border: 1px solid #ff4b2b;
  border-radius: 20px;
  background-color: #ff4b2b;
  padding: 10px 40px;
  font-size: 12px;
  text-transform: uppercase;
  color: white;
  transition: transform 85ms ease-in;
}
h1 {
  text-transform: capitalize;
  font-size: 30px;
}
p {
  margin: 10px 0 30px;
}
button:active {
  transform: scale(0.95);
}
.ghost {
  background-color: transparent;
  border-color: white;
}

.container {
  position: relative;
  width: 768px;
  max-width: 100%;
  min-height: 480px;
  background-color: white;
  box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);
  border-radius: 10px;
  overflow: hidden;
}

.form-container {
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: white;
  height: 100%;
  width: 50%;
  padding: 0 40px;
  transition: all 0.65s ease-in-out;
}
.form-container form {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.form-container input {
  width: 100%;
  height: 40px;
  margin: 8px 0;
  background-color: #eeeeee;
  border: none;
  font-size: 14px;
  padding: 0 20px;
}
.sign-in-container {
  z-index: 10;
}
.sign-up-container {
  z-index: 5;
}

.social-container {
  display: flex;
}
.social-container a {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 1px solid #ddd;
  line-height: 40px;
  text-align: center;
  color: #333;
  margin: 20px 8px;
}
.social-container a:hover {
  background-color: #222f3e;
  color: white;
  border-color: #cbcbcc;
}

.overlay-container {
  position: absolute;
  right: 0;
  width: 50%;
  height: 100%;
  background-color: tomato;
  overflow: hidden;
  transition: transform 0.65s ease-in-out;
  z-index: 100;
}
.overlay {
  position: absolute;
  display: flex;
  left: -100%;
  width: 200%;
  height: 100%;
  background: linear-gradient(to right, #ff4b2d, #ff426b);
}

.overlay-penal {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 50%;
  padding: 0 40px;
  text-align: center;
  color: white;
  font-size: 12px;
  background-color: rgba(50, 176, 22);
}
.forget {
  height: 20px;
  color: #9aa9b7;
  text-decoration: none;
  margin: 5px 0 15px;
  font-size: 12px;
  text-transform: capitalize;
}
.forget:hover {
  border-bottom: 2px tomato solid;
}

.overlay-left-container {
  transform: translateX(10%);
  transition: transform 0.65s ease-in-out;
}
.overlay-right-container {
  transform: translateX(0);
  transition: transform 0.65s ease-in-out;
}

.container.penal-right-active .sign-in-container {
  z-index: 5;
  transform: translateX(100%);
}

.container.penal-right-active .sign-up-container {
  z-index: 10;
  transform: translateX(100%);
}

.container.penal-right-active .overlay-container {
  transform: translateX(-100%);
}
.container.penal-right-active .overlay {
  transform: translateX(50%);
}
.container.penal-right-active .overlay-left-container {
  transform: translateX(0);
}
.container.penal-right-active .overlay-right-container {
  transform: translateX(-10%);
}
</style>
