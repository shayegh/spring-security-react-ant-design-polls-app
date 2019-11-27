import React from 'react';
import {Field as FormikField, Form as FormikForm, withFormik} from "formik";
import {Button, Col, Form, Row} from 'antd';
import * as yup from "yup";
import {setLocale} from "yup";
import {AntInput} from "../common/components/CreateAntFields";
import {createDetail} from '../util/APIUtils';
import {toast} from 'react-toastify';

const FormItem = Form.Item;

const InnerForm = ({
                       props,
                       values,
                       errors,
                       touched,
                       setFieldTouched,
                       setFieldValue,
                       isSubmitting,
                       handleSubmit,
                       handleReset,
                       submitCount,
                       dirty
                   }) => {
    return (
        <FormikForm onSubmit={handleSubmit}>
            <Row gutter={16}>
                <Col span={6}>
                    <FormikField
                        component={AntInput}
                        labelCol={{span: 12, offset: 12}}
                        label="توضیحات کارشناس"
                        name="srdComment"
                        type='text'
                        required={true}
                        hasFeedback
                    />
                </Col>
                <Col span={6}>
                    <FormikField
                        component={AntInput}
                        labelCol={{span: 12, offset: 12}}
                        label="تعداد خطا"
                        name="srdSubjectErrorCount"
                        type='text'
                        required={true}
                        hasFeedback
                    />
                </Col>
                <Col span={6}>
                    <FormikField
                        component={AntInput}
                        labelCol={{span: 12, offset: 12}}
                        label="تعداد بررسی"
                        name="srdSubjectCount"
                        type='text'
                        required={true}
                        hasFeedback
                    />
                </Col>
                <Col span={6}>
                    <FormikField
                        component={AntInput}
                        labelCol={{span: 12, offset: 12}}
                        label="موضوع"
                        name="srdSubject"
                        type='text'
                        required={true}
                        hasFeedback
                    />
                </Col>
            </Row>
            <Row>
                <Col span={8}>
                    <FormItem>
                        <Button htmlType="submit" type="primary" disabled={isSubmitting}>
                            افزودن
                        </Button>
                        <Button onClick={handleReset} type='danger' disabled={!dirty || isSubmitting}
                                style={{marginRight: 5}}>
                            بازنشانی
                        </Button>
                    </FormItem>
                </Col>
            </Row>
        </FormikForm>
    );
};

setLocale({
    mixed: {
        notType: function notType(_ref) {
            switch (_ref.type) {
                case 'number':
                    return 'مقدار این فیلد باید عددی باشد';
                case 'string':
                    return 'Not a string error or any other custom error message';
                default:
                    return 'Wrong type error or any other custom error message';
            }
        }
    }
});

const SupDetailForm = withFormik({
    enableReinitialize: true,
    mapPropsToValues: ({currentDetail}) => {
        console.log('Map Props to Value', currentDetail);
        return {
            srdSubject: currentDetail.srdSubject || '',
            srdSubjectCount: currentDetail.srdSubjectCount || 0,
            srdSubjectErrorCount: currentDetail.srdSubjectErrorCount || 0,
            srdComment: currentDetail.srdComment || '',

        };
    },
    validationSchema: yup.object().shape({
        srdComment: yup.string().required('فیلد توضیحات اجباری می باشد'),
        srdSubjectErrorCount: yup.number().positive('مقدار این فیلد باید عددی باشد').required('ورود تعداد خطا اجباری است'),
        srdSubjectCount: yup.number().positive('مقدار این فیلد باید عددی باشد').required('فیلد تعداد بررسی اجباری است'),
        srdSubject: yup.string().required('فیلد موضوع اجباری است')
    }),
    handleSubmit: (values, {resetForm, setErrors, setSubmitting, props}) => {

            console.log("Form values", values);
            createDetail(props.headerId,values)
                .then(response => {
                    toast.success('جزئیات با موفقیت ثبت شد');
                    // addHeader(response.oid);
                }).catch(error => {
                if (error.status === 401) {
                    toast.error('You have been logged out. Please login create poll.');
                } else {
                    console.log('Error Message :', error);
                    toast.error(error.message || 'Sorry! Something went wrong. Please try again!');
                }
            });
            props.addDetail(values);
            // alert(JSON.stringify(props.data, null, 2));
            // save
            setSubmitting(false);

    }
})(InnerForm);

export default SupDetailForm;