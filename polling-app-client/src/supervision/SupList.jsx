import React, {Component} from 'react';
import {POLL_LIST_SIZE} from "../constants";
import {deleteHeader, getAllHeaders, getUserCreatedPolls, getUserVotedPolls} from "../util/APIUtils";
import {Button, Form, Icon, Popconfirm, Table} from "antd";
import LoadingIndicator from "../common/LoadingIndicator";
import {Link} from "react-router-dom";
import {toast} from 'react-toastify';

const FormItem = Form.Item;

class SupList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            headers: [],
            page: 0,
            size: 10,
            totalElements: 0,
            totalPages: 0,
            last: true,
            currentVotes: [],
            isLoading: false
        };

    }

    loadHeaderList = (page = 0, size = POLL_LIST_SIZE) => {
        let promise;
        if (this.props.username) {
            if (this.props.type === 'USER_CREATED_POLLS') {
                promise = getUserCreatedPolls(this.props.username, page, size);
            } else if (this.props.type === 'USER_VOTED_POLLS') {
                promise = getUserVotedPolls(this.props.username, page, size);
            }
        } else {
            promise = getAllHeaders(page, size);
        }

        if (!promise) {
            return;
        }

        this.setState({
            isLoading: true
        });

        promise
            .then(response => {
                const headers = this.state.headers.slice();

                this.setState({
                    headers: headers.concat(response.content),
                    page: response.page,
                    size: response.size,
                    totalElements: response.totalElements,
                    totalPages: response.totalPages,
                    last: response.last,
                    isLoading: false
                })
            }).catch(error => {
            this.setState({
                isLoading: false
            })
        });

    };

    columns = [
        {
            title: ' موضوع بازدید',
            dataIndex: 'surveySubject',
            key: 'surveySubject',
        },
        {
            title: 'شماره حکم ماموریت',
            dataIndex: 'missionNo',
            key: 'missionNo',
        },
        {
            title: ' شعبه',
            dataIndex: 'brchName',
            key: 'brchName',
        },
        {
            title: ' واحد',
            dataIndex: 'unitName',
            key: 'unitName',
        },
        {
            title: ' تاریخ بازدید',
            dataIndex: 'surveyDate',
            key: 'surveyDate',
        },
        {
            title: 'تاریخ بازدید قبلی',
            dataIndex: 'preSurveyDate',
            key: 'preSurveyDate',
        },
        {
            title: 'کارشناس ناظر',
            dataIndex: 'supervisorName',
            key: 'supervisorName',
            // defaultSortOrder: 'descend',
            // sorter: (a, b) => a.age - b.age,
        },
        {
            title: ' تاریخ تنظیم گزارش',
            dataIndex: 'surveyCreateDate',
            key: 'surveyCreateDate',
        },
        {
            title: 'عملیات',
            dataIndex: 'id',
            key: 'key',
            render: (text, record) => {
                return (
                    <div>
                        <Link to={`/newsuprep/${text}`}>
                            <Icon type="edit" theme="twoTone" style={{marginLeft: 5}}/>
                        </Link>
                        <Popconfirm
                            title="آیا از حذف مطمئن هستید؟"
                            onConfirm={() => {
                                this.deleteHeader(record);
                            }}
                            onCancel={this.cancel}
                            okText="بله"
                            cancelText="خیر"
                        >
                            <Icon type="delete" theme="twoTone" twoToneColor='#eb2f96'/>
                        </Popconfirm>
                    </div>
                )
            }
        }
    ];

    edit = (e) => {
        // console.log('Edit Header ID:', e);
        this.props.history.push(`/newsuprep/${e}`);
    };
    cancel = (e) => {
        // console.log(e);
        // message.error('Click on No');
    };

    deleteHeader = (header) => {
        let promise = deleteHeader(header.id);
        promise.then(response => {
                console.log('DeleteHeader Response :', response);
                const headers = this.state.headers.filter(hr => hr.id !== header.id);
                this.setState({headers});
                toast.success('اطلاعات با موفقیت حذف شد');
            }
        ).catch(error => {
            console.log('Error :', error);
            toast.error('error');
            this.setState({
                isLoading: false
            });
        })

    };


    componentDidMount() {
        this.loadHeaderList();
    }


    render() {
        return (
            <div className="App">
                {this.state.isLoading ?
                    <LoadingIndicator/> :
                    <div>
                        <Table dataSource={this.state.headers} columns={this.columns} size="small"/>
                        <FormItem>

                            <Button htmlType="submit" type="primary">
                                <Link to='/newsuprep'>
                                    جدید
                                </Link>
                            </Button>
                        </FormItem>
                    </div>}

            </div>
        );
    }
}

export default SupList;