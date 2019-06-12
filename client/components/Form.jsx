import React from 'react';
import { Button, Form } from 'react-bootstrap';
import { Formik } from 'formik';
import * as yup from 'yup';
import { forEach, map } from 'lodash/fp';

const FormComponent = props => {
    const initialValues = {};
    let schema = {};

    forEach(({ key, initialValue = '', validations }) => {
        schema[key] = validations;
        initialValues[key] = initialValue;
    }, props.fields);

    schema = yup.object(schema);

    const _getFormBody = ({
        values,
        handleChange,
        touched,
        setTouched,
        errors,
    }) =>
        map(
            field => (
                <Form.Group key={field.key} controlId={field.key}>
                    <Form.Label>{field.label}</Form.Label>
                    <Form.Control
                        name={field.key}
                        type={field.type}
                        as={field.as}
                        value={values[field.key] || ''}
                        onChange={handleChange}
                        isValid={touched[field.key] && !errors[field.key]}
                        onBlur={() =>
                            setTouched({ ...touched, [field.key]: true })
                        }
                        {...field.props}
                    />
                    <Form.Control.Feedback
                        style={{
                            display: 'block',
                        }}
                        type="invalid"
                    >
                        {touched[field.key] && errors[field.key]}
                    </Form.Control.Feedback>
                </Form.Group>
            ),
            props.fields,
        );

    return (
        <Formik
            validationSchema={schema}
            initialValues={initialValues}
            onSubmit={props.onSubmit}
        >
            {validationData => (
                <Form noValidate onSubmit={validationData.handleSubmit}>
                    {_getFormBody(validationData)}
                    <Button
                        disabled={!validationData.isValid}
                        variant="info"
                        type="submit"
                        className="mr-2"
                    >
                        Submit
                    </Button>
                    {props.actionText && (
                        <Button
                            variant="secondary"
                            onClick={props.onClickAction}
                        >
                            {props.actionText}
                        </Button>
                    )}
                </Form>
            )}
        </Formik>
    );
};

export default FormComponent;
