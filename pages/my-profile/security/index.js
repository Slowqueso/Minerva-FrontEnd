import React from 'react'
import FullLayout from '../../../components/Layout/FullLayout'
import styles from '../styles.module.css'
import MyProfileNavbar from '../../../components/my-profile/navbar/MyProfileNavbar'
import TextBox from '../../../components/form/textBox'
import SubmitButton from '../../../components/form/SubmitButton'

const Security = () => {
  return (
    <>
      <FullLayout>
        <div className={styles.my_profile}>
          <MyProfileNavbar />
          <div className={styles.security}>
            <h1>Security</h1>
            <h3>Change Password</h3>
            <form>
              <TextBox
              label={"Old Password"}/>
              <TextBox
              label={"New Password"}/>
              <TextBox
              label={"Confirm New Password"}/>
              <SubmitButton
              label={"Change Password"}/>
              
            </form>
            <h3>Two-Factor Authentication</h3>
            <p>An Extra Layer of Account Security <br/>
            <br/>Add an extra layer of protection to your account with 2-Step Verification at login, account recovery, and high-value transactions. You can only enable one of the following options at a time.</p>
            <div className={styles.tfa}>
              <div className={styles.tfa_option}>
                <h5>Email Authentication</h5>
                <input type="checkbox" id="switch" /><label for="switch"></label>
              </div>
              <hr/>
              <p>Receive Unique Authentication codes at j******@gmail.com</p>
            </div>
          </div>
        </div>
      </FullLayout>
    </>
  )
}

export default Security