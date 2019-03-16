<template>
  <section class="login">
    <article class="login-box">
      <div class="login-logo">
        <img src="http://images.boblog.com/BOBLOG-03.png" alt>
      </div>
      <Form ref="formInline" :model="formInline" :rules="ruleInline">
        <FormItem prop="username">
          <Input type="text" v-model="formInline.username" placeholder="Username">
            <Icon type="ios-person-outline" slot="prepend"></Icon>
          </Input>
        </FormItem>
        <FormItem prop="password">
          <Input type="password" v-model="formInline.password" placeholder="Password">
            <Icon type="ios-lock-outline" slot="prepend"></Icon>
          </Input>
        </FormItem>
        <FormItem class="btn-form">
          <Button type="primary" @click="handleSubmit('formInline')">Login</Button>

          <Button type="info" @click="registerSubmit('formInline')">register</Button>
        </FormItem>
      </Form>
    </article>
  </section>
</template>
<script>
import { mapState, mapActions } from "vuex";

export default {
  data() {
    return {
      formInline: {
        username: "",
        password: ""
      },
      ruleInline: {
        username: [
          {
            required: true,
            message: "Please fill in the user username",
            trigger: "blur"
          }
        ],
        password: [
          {
            required: true,
            message: "Please fill in the password.",
            trigger: "blur"
          },
          {
            type: "string",
            min: 6,
            message: "The password length cannot be less than 6 bits",
            trigger: "blur"
          }
        ]
      }
    };
  },
  methods: {
    ...mapActions({
      userLogin: "user/userLogin",
      userRegister: "user/userRegister"
    }),
    handleSubmit(name) {
      this.$refs[name].validate(async valid => {
        if (valid) {
          try {
            const ret = await this.userLogin(this.formInline);
            this.$ls.set("BOBLOG_ADMIN_TOKEN", ret.token);

            const BOBLOG_ADMIN_TOKEN = this.$ls.get("BOBLOG_ADMIN_TOKEN");
            if (BOBLOG_ADMIN_TOKEN) {
              this.$Message.success("登录成功!");
              window.location.href = "/user/index";
            }
          } catch (e) {
            this.$Message.error("登录失败！");
            console.log(e);
          }
        } else {
          this.$Message.error("Fail!");
        }
      });
    },
    registerSubmit(name) {
      this.$refs[name].validate(async valid => {
        if (valid) {
          try {
            await this.userRegister(this.formInline);
            this.$Message.success("注册成功");
          } catch (e) {
            this.$Message.error("注册失败！");
          }
        } else {
          this.$Message.error("Fail!");
        }
      });
    }
  }
};
</script>
<style scoped lang="scss">
.login {
  display: flex;
  justify-content: center;
  width: 100%;
  height: 100vh;
  border: 1px solid #f00;
}

.login-box {
  width: 520px;
  height: 420px;
}

.login-logo {
  height: 240px;
  margin-bottom: 32px;
  & img {
    width: 100%;
  }
}
.btn-form {
  margin-top: 65px;
  /deep/ .ivu-form-item-content {
    width: 100%;
    display: flex;
    justify-content: space-around;
    button {
      height: 25%;
      width: 40%;
    }
  }
}
</style>
