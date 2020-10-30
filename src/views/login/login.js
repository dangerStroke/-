export default {
  data() {
    return {
      formInline: {
        user: "",
        password: ""
      },
      ruleInline: {
        user: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { type: "string", min: 1, message: "", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { type: "string", min: 1, message: "", trigger: "blur" }
        ]
      },
      loginText: localStorage.getItem("loginText"),
      administratorRole: "", //管理员角色  0为超级管理员 1为系统管理员  2为城际管理员  3为紧急救援人员  4为调度管理员
      routeName: ""
    };
  },
  created() {
    this.routeName = this.$route.name
  },
  mounted() {
    // 绑定enter事件
    this.enterKeyup();
  },
  destroyed() {
    // 销毁enter事件
    this.enterKeyupDestroyed();
  },
  methods: {
    enterKey(event) {
      if (this.routeName == "login") {
        const code = event.keyCode
          ? event.keyCode
          : event.which
            ? event.which
            : event.charCode;
        if (code == 13) {
          this.handleSubmit(this.formInline);
        }
      }
    },
    enterKeyupDestroyed() {
      document.removeEventListener("keyup", this.enterKey);
    },
    enterKeyup() {
      document.addEventListener("keyup", this.enterKey);
    },
    handleSubmit(prop) {
      let user = prop.user;
      let password = prop.password;
      let data = {
        name: user,
        password: password
      };
      //请求登录接口
      this.$post("/admin/index/login", data).then(res => {
        if (res.code == 200) {
          localStorage.setItem("loginTK", res.data.authorization)
          localStorage.setItem("user", JSON.stringify(res.data))
          this.$Message.info('登录成功')
          this.$router.push({
            path: "/home"
          })
          // if (res.data.role == "超级管理员") {
          //   this.administratorRole = 0;
          // } else if (res.data.role == "系统管理员") {
          //   this.administratorRole = 1;
          // } else if (res.data.role == "城际管理员") {
          //   this.administratorRole = 2;
          // } else if (res.data.role == "紧急救援人员") {
          //   this.administratorRole = 3;
          // } else if (res.data.role == "调度管理员") {
          //   this.administratorRole = 4;
          // }
        } else {
          //登录失败
          this.$Message.warning(res.error)
        }
      });
    }
  }
};