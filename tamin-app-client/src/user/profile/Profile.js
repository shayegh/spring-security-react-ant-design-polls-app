import React, {Component} from 'react';
import {getUserProfile} from 'util/api';
import {Avatar} from 'antd';
import {getAvatarColor} from 'util/Colors';
import {formatDate} from 'util/Helpers';
import LoadingIndicator from 'common/LoadingIndicator';
import './Profile.css';
import ServerError from 'common/ServerError';
import NotFound from 'common/NotFound';


class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: null,
            isLoading: false
        }
    }

    loadUserProfile = (username) => {
        this.setState({
            isLoading: true
        });

        getUserProfile(username)
            .then(response => {
                this.setState({
                    user: response,
                    isLoading: false
                });
            }).catch(error => {
            if (error.status === 404) {
                this.setState({
                    notFound: true,
                    isLoading: false
                });
            } else {
                this.setState({
                    serverError: true,
                    isLoading: false
                });
            }
        });
    }

    componentDidMount() {
        const username = this.props.match.params.username;
        this.loadUserProfile(username);
    }

    componentDidUpdate(nextProps) {
        if (this.props.match.params.username !== nextProps.match.params.username) {
            this.loadUserProfile(nextProps.match.params.username);
        }
    }

    render() {
        if (this.state.isLoading) {
            return <LoadingIndicator/>;
        }

        if (this.state.notFound) {
            return <NotFound/>;
        }

        if (this.state.serverError) {
            return <ServerError/>;
        }

        let user = this.state.user;
        return (
            <div className="profile">
                {
                    user ? (
                        <div className="user-profile">
                            <div className="user-details">
                                <div className="user-avatar">
                                    <Avatar className="user-avatar-circle"
                                            style={{backgroundColor: getAvatarColor(user.name)}}>
                                        {user.name[0].toUpperCase()}
                                    </Avatar>
                                </div>
                                <div className="user-summary">
                                    <div className="full-name">{user.name}</div>
                                    <div className="username">@{user.username}</div>
                                    <div className="user-joined">
                                        Joined {formatDate(user.joinedAt)}
                                    </div>
                                    <div className="full-name">{user.brchName}</div>
                                    <div className="full-name">{user.unitName}</div>

                                </div>
                            </div>
                            {/*<div className="user-poll-details">    */}
                            {/*    <Tabs defaultActiveKey="1" */}
                            {/*        animated={false}*/}
                            {/*        tabBarStyle={tabBarStyle}*/}
                            {/*        size="large"*/}
                            {/*        className="profile-tabs">*/}
                            {/*        <TabPane tab={`${this.state.user.pollCount} Polls`} key="1">*/}
                            {/*            <PollList username={this.props.match.params.username} type="USER_CREATED_POLLS" />*/}
                            {/*        </TabPane>*/}
                            {/*        <TabPane tab={`${this.state.user.voteCount} Votes`}  key="2">*/}
                            {/*            <PollList username={this.props.match.params.username} type="USER_VOTED_POLLS" />*/}
                            {/*        </TabPane>*/}
                            {/*    </Tabs>*/}
                            {/*</div>  */}
                        </div>
                    ) : null
                }
            </div>
        );
    }
}

export default Profile;