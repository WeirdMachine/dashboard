// Code generated by go-swagger; DO NOT EDIT.

package models

// This file was generated by the swagger tool.
// Editing this file might prove futile when you re-run the swagger generate command

import (
	"context"

	"github.com/go-openapi/errors"
	"github.com/go-openapi/strfmt"
	"github.com/go-openapi/swag"
)

// SeedStatus SeedStatus stores the current status of a Seed.
//
// swagger:model SeedStatus
type SeedStatus struct {

	// name
	Name string `json:"name,omitempty"`

	// phase
	Phase SeedPhase `json:"phase,omitempty"`
}

// Validate validates this seed status
func (m *SeedStatus) Validate(formats strfmt.Registry) error {
	var res []error

	if err := m.validatePhase(formats); err != nil {
		res = append(res, err)
	}

	if len(res) > 0 {
		return errors.CompositeValidationError(res...)
	}
	return nil
}

func (m *SeedStatus) validatePhase(formats strfmt.Registry) error {
	if swag.IsZero(m.Phase) { // not required
		return nil
	}

	if err := m.Phase.Validate(formats); err != nil {
		if ve, ok := err.(*errors.Validation); ok {
			return ve.ValidateName("phase")
		} else if ce, ok := err.(*errors.CompositeError); ok {
			return ce.ValidateName("phase")
		}
		return err
	}

	return nil
}

// ContextValidate validate this seed status based on the context it is used
func (m *SeedStatus) ContextValidate(ctx context.Context, formats strfmt.Registry) error {
	var res []error

	if err := m.contextValidatePhase(ctx, formats); err != nil {
		res = append(res, err)
	}

	if len(res) > 0 {
		return errors.CompositeValidationError(res...)
	}
	return nil
}

func (m *SeedStatus) contextValidatePhase(ctx context.Context, formats strfmt.Registry) error {

	if err := m.Phase.ContextValidate(ctx, formats); err != nil {
		if ve, ok := err.(*errors.Validation); ok {
			return ve.ValidateName("phase")
		} else if ce, ok := err.(*errors.CompositeError); ok {
			return ce.ValidateName("phase")
		}
		return err
	}

	return nil
}

// MarshalBinary interface implementation
func (m *SeedStatus) MarshalBinary() ([]byte, error) {
	if m == nil {
		return nil, nil
	}
	return swag.WriteJSON(m)
}

// UnmarshalBinary interface implementation
func (m *SeedStatus) UnmarshalBinary(b []byte) error {
	var res SeedStatus
	if err := swag.ReadJSON(b, &res); err != nil {
		return err
	}
	*m = res
	return nil
}